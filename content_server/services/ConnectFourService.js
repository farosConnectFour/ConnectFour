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

//Public
var self = module.exports = {

    newGame : function(host, gameId){
        var newGame = {game: new ConnectFour(), gameId: gameId, players: [host], currentPlayer: host};
        games.push(newGame);
    },

    joinGame : function(challenger, gameId){
        var game = getGameByGameId(gameId);
        if(game.players.length === 1){
            game.players.push(challenger);
        }
    },

    getGame : function(client, gameId){
        var game = getGameByGameId(gameId);
        var message = {messageType: 'boardInfo', game : game};
        WebSocketService.sendToSingleClient(message, client);
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