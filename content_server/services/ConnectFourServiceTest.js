/**
 * Created by peeteli on 17/09/2015.
 */

//Private
var ConnectFour = require('../models/ConnectFour');
var WebSocketService = require("./WebSocketService.js");

var games = [];
var testWord = undefined;

function getGameByGameId(gameId){
    games.forEach(function(game){
        if(game.gameId === gameId){
            return game;
        }
    })
}

//Public
var self = module.exports = {

    newGame : function(host, gameId){
        var newGame = {game: new ConnectFour(), gameId: gameId, players: [host], currentPlayer: host};
        games.push(newGame);

        console.log(newGame);
    },

    joinGame : function(challenger, gameId){
        var game = getGameByGameId(gameId);
        if(game.players.length === 1){
            game.players.push(challenger);
        }

        console.log(game);
    },

    setTestWord : function(newWord){
        testWord = newWord;
    },

    getTestWord : function(){
        return testWord;
    }
};