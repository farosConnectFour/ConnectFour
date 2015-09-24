/**
 * Created by peeteli on 17/09/2015.
 */

//Private
var ConnectFour = require('../models/ConnectFour');
var WebSocketService = require('./WebSocketService.js');
var requestify = require('requestify');
var mysql = require('mysql');

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

function insertGameToDB(game, winner){
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'connectFour',
        multipleStatements: true
    });
    connection.connect();
    connection.query('INSERT INTO games SET ?;UPDATE USERS SET points = points + 10 WHERE userID = ?;UPDATE USERS SET points = points - 10 WHERE userID = ?', [{player1: game.players[0], player2: game.players[1], rated: game.rated, winner: winner},winner,game.currentPlayer], function(err, result){
        console.log(err);
        requestify.post("http://localhost:8080/connectfour/api/games", {gameId: result[0].insertId, password: 'HAHALOLHAHA'});
    });
    connection.end();
}

//Public
var self = module.exports = {

    newGame : function(host, challenger, gameId, rated){
        var players = [host, challenger];
        var newGame = {game: new ConnectFour(), gameId: gameId, players: players, currentPlayer: players[getStartingPlayer()], rated: rated};
        games.push(newGame);
    },

    getGame : function(client, gameId){
        var game = getGameByGameId(gameId);
        var message = {messageType: 'boardInfo', game : game};
        WebSocketService.sendToSingleClient(message, client);
    },

    makeAMove: function(clients, gameId, playerId, column, watcherIds, callbackIfGameEnded) {
        var game = getGameByGameId(gameId);
        if (game) {
            var result;
            if (playerId === game.currentPlayer) {
                result = game.game.play(column);
                if (result) {
                    result.winner = game.game.winner ? game.currentPlayer : false;
                    result.currentPlayer = nextPlayer(game.currentPlayer, game.players);
                    game.currentPlayer = nextPlayer(game.currentPlayer, game.players);
                    var message = {messageType: 'movePlayed', result: result};
                    game.players.forEach(function (playerId) {
                        WebSocketService.sendToSingleClient(message, findClientByUserID(playerId, clients));
                    });

                    watcherIds.forEach(function (watcherId) {
                        WebSocketService.sendToSingleClient(message, findClientByUserID(watcherId, clients));
                    });

                    if (game.game.winner) {
                        var winnerMessage = {messageType: 'involvedGameClosed', reason: "Closing game in 5 seconds because we got a winner!! :)"};
                        watcherIds.forEach(function (watcherId) {
                            WebSocketService.sendToSingleClient(winnerMessage, findClientByUserID(watcherId, clients));
                        });
                        game.players.forEach(function (playerId) {
                            WebSocketService.sendToSingleClient(winnerMessage, findClientByUserID(playerId, clients));
                        });
                        WebSocketService.sendToSingleClient(message, findClientByUserID(playerId, clients));
                        insertGameToDB(game, result.winner);
                        deleteGame(gameId);
                        callbackIfGameEnded(gameId);
                    }
                } else {
                    var message = {messageType: 'error', error: "Illegal move played"};
                    WebSocketService.sendToSingleClient(message, findClientByUserID(playerId, clients));
                }
            }
        }
    }
};