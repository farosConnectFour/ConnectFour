var WebSocketService = require("./WebSocketService.js");
var Game = require("../models/Game.js");

var games = [],
    currentGameId = 0;

function clientIsPlaying(clientUserId){
    for(var i = 0 ; i < games.length ; i++){
        if(games[i].challenger == clientUserId || (games[i].host == clientUserId && games[i].challenger != null)){
            return true;
        }
    }
    return false;
}

function clientAlreadyHosting(clientUserId){
    for(var i = 0 ; i < games.length ; i++){
        if(games[i].host == clientUserId){
            return true;
        }
    }
    return false;
}

function findClientByUserID(userId, clients){
    for (var client in clients){
        if(clients[client].user && clients[client].user.id === userId){
            return clients[client];
        }
    }
    return -1;
}

function hostTriesToJoinOwnGame(client, gameId){
    for(var i = 0 ; i < games.length ; i++){
        if(games[i].gameId === gameId){
            return games[i].host === client.user.id;
        }
    }
}

function setGameChallenger(gameId, clientUserId){
    for(var i = 0 ; i < games.length ; i++){
        if(games[i].gameId === gameId){
            games[i].challenger = clientUserId;
            return games[i];
        }
    }
}

function closeHostedGames(clientUserId){
    for(var i = games.length -1 ; i >= 0  ; i--){
        if(games[i].host === clientUserId){
            var gameId = games[i].gameId;
            games.splice(i, 1);
            return gameId;
        }
    }
    return null;
}

function getGameByGameId(gameId){
    for(var i = 0; i < games.length; i++){
        if(games[i].gameId == gameId){
            return games[i];
        }
    }
}

//Public
var self = module.exports = {

    createGame : function(client, clients, game){
        if (clientIsPlaying(client.user.id) || clientAlreadyHosting(client.user.id)) {
            var message = {messageType: 'error', error: "You are already hosting or playing, so you cant create a new Game!"};
            WebSocketService.sendToSingleClient(message, client);
        } else {
            var newGame = new Game(currentGameId, game.name, client.user.id, null, game.rated, []);
            currentGameId++;
            games.push(newGame);
            var messageNewGame = {messageType: "gameCreated", game: newGame};
            WebSocketService.broadcast(messageNewGame, clients);

            //ConnectFourService.newGame(newGame.host, newGame.gameId);
        }
    },

    loadGames : function(client){
        var message = {messageType: 'initGamesLoaded', games : games };
        WebSocketService.sendToSingleClient(message, client);
    },

    removeUserFromGames : function(client, clients){
        var gamesToDelete = [];
        var reason = "";
        games.forEach(function(game){
            var messageResigned = {messageType: 'involvedGameClosed', reason: client.user.username + " resigned from this game due to logout"};
            if(game.host === client.user.id){
                gamesToDelete.push(game.gameId);
                if(game.challenger){
                    WebSocketService.sendToSingleClient(messageResigned, findClientByUserID(game.challenger, clients));
                    game.watchers.forEach(function(watcherId){
                        WebSocketService.sendToSingleClient(messageResigned, findClientByUserID(watcherId, clients));
                    });
                }
            } else if(game.challenger === client.user.id){
                gamesToDelete.push(game.gameId);
                WebSocketService.sendToSingleClient(messageResigned, findClientByUserID(game.host, clients));
                game.watchers.forEach(function(watcherId){
                    WebSocketService.sendToSingleClient(messageResigned, findClientByUserID(watcherId, clients));
                });
            } else if(game.watchers.indexOf(client.user.id) > -1){
                game.watchers.splice(game.watchers.indexOf(client.user.id), 1);
                var messageWatcherLeft = {messageType: 'watcherLeft', gameId: game.gameId, watcherId: client.user.id};
                WebSocketService.broadcast(messageWatcherLeft, clients);
            }
        });
        gamesToDelete.forEach(function(index){
            for(var i = 0; i < games.length; i++){
                if(games[i].gameId === index){
                    var messageGameClosed = {messageType: 'gameClosed', game: games[i].gameId};
                    games.splice(i, 1);
                    WebSocketService.broadcast(messageGameClosed, clients);
                }
            }
        });
    },

    joinGame : function(client, clients, gameId, callbackIfSuccesFull){
        if (clientIsPlaying(client.user.id)) {
            var messageErrorChallenging = {messageType: 'error', error: "you are already playing, So you cannot play in another"};
            WebSocketService.sendToSingleClient(messageErrorChallenging, client);
        } else if(hostTriesToJoinOwnGame(client, gameId)){
            var messageErrorHost = {messageType: 'error', error: "You obviously can't join your own game... !!!"};
            WebSocketService.sendToSingleClient(messageErrorHost, client);
        } else {
            var game = setGameChallenger(gameId, client.user.id);
            var messageGameStarted = {messageType: 'gameStarted', gameId: game.gameId, challengerId: game.challenger};
            WebSocketService.broadcast(messageGameStarted, clients);

            var messagePlayTime = {messageType: 'playTime', game: game.gameId};
            WebSocketService.sendToSingleClient(messagePlayTime, client);
            WebSocketService.sendToSingleClient(messagePlayTime, findClientByUserID(game.host, clients));

            var roomToDelete = closeHostedGames(client.user.id);
            if(roomToDelete != null){
                var messageDeleteRoom = {messageType: 'gameClosed', game: roomToDelete};
                WebSocketService.broadcast(messageDeleteRoom, clients);
            }
            callbackIfSuccesFull(game);
        }
    },

    watchGame : function(client, clients, gameId){
        games.forEach(function(game){
            if(game.gameId == gameId){
                if(game.watchers.indexOf(client.user.id) != -1){
                    var messageError = {messageType: 'error', error: "You are already watching this game..."};
                    WebSocketService.sendToSingleClient(messageError, client);
                } else{
                    game.watchers.push(client.user.id);
                    var messagePlayTime = {messageType: 'newWatcher', gameId: gameId, watcherId: client.user.id};
                    WebSocketService.broadcast(messagePlayTime, clients);

                    var messageWatchTime = {messageType: 'watchTime', gameId: gameId};
                    WebSocketService.sendToSingleClient(messageWatchTime, client);
                }
            }
        })
    },

    stopWatching : function(client, clients, gameId){
        games.forEach(function(game){
            if(game.gameId == gameId){
                var watcherIndex = game.watchers.indexOf(client.user.id);
                if(watcherIndex != -1){
                    game.watchers.splice(watcherIndex, 1);
                    var messageWatcherLeft = {messageType: 'watcherLeft', gameId: game.gameId, watcherId: client.user.id};
                    WebSocketService.broadcast(messageWatcherLeft, clients);
                }
            }
        });
    },

    getWatchersForGame : function(gameId) {
        return getGameByGameId(gameId).watchers;
    },

    getGameIdForPlayer : function(userId) {
        games.forEach(function (game) {
            if (game.host === userId || game.challenger === userId) {
                return game.gameId;
            }
        });
    },

    removeGame : function(gameId, clients){
        games.forEach(function(game, index){
            if(game.gameId == gameId){
                games.splice(index,1);
                var messageDeleteRoom = {messageType: 'gameClosed', game: gameId};
                WebSocketService.broadcast(messageDeleteRoom, clients);
            }
        });
    },

    getGameById : getGameByGameId
};