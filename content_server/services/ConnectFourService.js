/**
 * Created by peeteli on 17/09/2015.
 */

//Private
var ConnectFour = require('../models/ConnectFour');
var WebSocketService = require("./WebSocketService.js");

var games = [];

function getGameByGameId(gameId){
    for(var i = 0; i < games.length; i++){
        if(games[i].gameId == gameId){
            return games[i];
        }
    }
}

function getGameForPlayer(userId) {
    for(var i = 0; i < games.length; i++){
        if(games[i].players.indexOf(userId) > -1){
            return games[i];
        }
    }
}

function nextPlayer(currentPlayer, players) {
    return currentPlayer === players[0] ? players[1] : players[0];
}

function getStartingPlayer(){
    return Math.floor(Math.random() * 2);
}

function deleteGame(gameId){
    for(var i = 0; i < games.length; i++){
        if(games[i].gameId === gameId){
            games.splice(i, 1);
        }
    }
}

function findClientByUserID(userId, clients){
    for (var client in clients){
        if(clients[client].user && clients[client].user.id === userId){
            return clients[client];
        }
    }
    return -1;
}

//Public
var self = module.exports = {

    newGame : function(host, challenger, gameId){
        var players = [host, challenger];
        var newGame = {game: new ConnectFour(), gameId: gameId, players: players, currentPlayer: players[getStartingPlayer()]};
        games.push(newGame);
    },

    getGame : function(client, gameId){
        var game = getGameByGameId(gameId);
        var message = {messageType: 'boardInfo', game : game};
        WebSocketService.sendToSingleClient(message, client);
    },

    makeAMove: function(clients, gameId, playerId, column, watcherIds, leaderboardServer) {
        var game = getGameByGameId(gameId);
        if (game) {
            var result;
            if (playerId === game.currentPlayer) {
                //console.log(leaderboardServer);
                //leaderboardServer.send("/app/gamePlayed", {}, JSON.stringify({gameId: gameId}));
                result = game.game.play(column);
                if (result) {
                    result.winner = game.game.winner ? game.currentPlayer : false;
                    result.currentPlayer = nextPlayer(game.currentPlayer, game.players);
                    game.currentPlayer = nextPlayer(game.currentPlayer, game.players);

                    if (game.game.winner) {
                        deleteGame(gameId);
                        //TODO: close room, broadcast
                    }
                    var message = {messageType: 'movePlayed', result: result};
                    game.players.forEach(function (playerId) {
                        WebSocketService.sendToSingleClient(message, findClientByUserID(playerId, clients));
                    });
                    watcherIds.forEach(function (watcherId) {
                        WebSocketService.sendToSingleClient(message, findClientByUserID(watcherId, clients));
                    });
                } else {
                    var message = {messageType: 'error', error: "Illegal move played"};
                    WebSocketService.sendToSingleClient(message, findClientByUserID(playerId, clients));
                }
            }
        }
    }

};






//
//var ConnectFour = require('../models/ConnectFour');
//var WebSocketService = require("./WebSocketService.js");
//
//function ConnectFourService(){
//    this.games = [];
//    //this.players = [];
//    //this.currentPlayer = 0;
//    //this.game;
//    this.getGameByGameId = function(gameId){
//        this.games.forEach(function(game){
//            if(game.gameId === gameId){
//                return game;
//            }
//        })
//    };
//
//}
//
//ConnectFourService.prototype.newGame = function(host, gameId){
//    var newGame = {game: new ConnectFour(), gameId: gameId, players: [host], currentPlayer: host};
//    this.games.push(newGame);
//};
//
//ConnectFourService.prototype.joinGame = function(challenger, gameId){
//    console.log(gameId);
//    console.log(this.games);
//    var game = this.getGameByGameId(gameId);
//    console.log(game);
//    if(game.players.length === 1){
//        game.players.push(challenger);
//    }
//
//    console.log(game);
//};
//
//ConnectFourService.prototype.addPlayer = function(challenger){
//    if(this.players.length === 1) {
//        this.players.push(challenger);
//    }
//};
//
//ConnectFourService.prototype.removePlayer = function (removedPlayer) {
//    var plys = this.players.length;
//
//    for (var i = 0; i < plys; i++) {
//        var ply = this.players[i];
//
//        if (ply.id === removedPlayer.id) {
//            this.players.splice(i, 1);
//
//            if (this.currentPlayer > i) {
//                this.currentPlayer--;
//            } else if (this.currentPlayer === i) {
//                this.currentPlayer--;
//                //inform next player that its his turn..
//            }
//
//            return;
//        }
//    }
//};
//
//ConnectFourService.prototype.play = function (ply, col) {
//    var result;
//
//    if (ply.id === this.players[this.currentPlayer].id) {
//        result = this.game.play(col);
//        this.nextPlayer();
//    }
//
//    return result;
//};
//
//ConnectFourService.prototype.getWinner = function() {
//    return this.game.getWinner();
//};
//
//ConnectFourService.prototype.isDraw = function() {
//    return this.game.isDraw();
//};
//
//ConnectFourService.prototype.nextPlayer = function() {
//    if (++this.currentPlayer === this.players.length) {
//        this.currentPlayer = 0;
//    }
//};
//
//module.exports = ConnectFourService;