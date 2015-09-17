var WebSocketService = new (require("./WebSocketService.js"))();
var Game = require("../models/Game.js");

var games = [],
    currentGameId = 0;

function clientIsChallenging(clientUserId){
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

//Public
var self = module.exports = {

    createGame : function(client, clients, game){
        if (clientIsChallenging(client.user.id) || clientAlreadyHosting(client.user.id)) {
            var message = {messageType: 'error', error: "You are already hosting or playing, so you cant create a new Game!"};
            WebSocketService.sendToSingleClient(message, client);
        } else {
            var newGame = new Game(currentGameId, game.name, client.user.id, null, game.rated, []);
            currentGameId++;
            games.push(newGame);
            var messageNewGame = {messageType: "gameCreated", game: newGame};
            WebSocketService.broadcast(messageNewGame, clients);
        }
    },

    loadGames : function(client){
        var message = {messageType: 'initGamesLoaded', games : games };
        WebSocketService.sendToSingleClient(message, client);
    },

    removeUserFromGames : function(client, clients){
        var gamesToDelete = [];
        games.forEach(function(game){
            var messageResigned = {messageType: 'playerResigned', player: client.user};
            if(game.host === client.user.id){
                gamesToDelete.push(game.gameId);
                if(game.challenger){
                    WebSocketService.sendToSingleClient(messageResigned, findClientByUserID(game.challenger));
                    game.watchers.forEach(function(watcherId){
                        WebSocketService.sendToSingleClient(messageResigned, findClientByUserID(watcherId));
                    });
                }
            } else if(game.challenger === client.user.id){
                gamesToDelete.push(game.gameId);
                WebSocketService.sendToSingleClient(messageResigned, findClientByUserID(game.host));
                game.watchers.forEach(function(watcherId){
                    WebSocketService.sendToSingleClient(messageResigned, findClientByUserID(watcherId));
                });
            } else if(game.watchers.indexOf(client.user.id) > -1){
                game.watchers.splice(game.watchers.indexOf(client.user.id), 1);
                var messageWatcherLeft = {messageType: 'watcherLeft', game: game.gameId, watcher: client.user};
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

    joinGame : function(client, clients, gameId){
        if (clientIsChallenging(client.user.id)) {
            var messageErrorChallenging = {messageType: 'error', error: "you are already playing, So you cannot play in another"};
            WebSocketService.sendToSingleClient(messageErrorChallenging, client);
        } else if(hostTriesToJoinOwnGame(client, gameId)){
            var messageErrorHost = {messageType: 'error', error: "You obviously can't join your own game... !!!"};
            WebSocketService.sendToSingleClient(messageErrorHost, client);
        } else {
            var game = setGameChallenger(gameId, client.user.id);
            var messageUpdateRoom = {messageType: 'updateRoom', game: game};
            WebSocketService.broadcast(messageUpdateRoom, clients);

            var roomToDelete = closeHostedGames(client.user.id);
            if(roomToDelete != null){
                var messageDeleteRoom = {messageType: 'gameClosed', game: roomToDelete};
                WebSocketService.broadcast(messageDeleteRoom, clients);
            }

            var messagePlayTime = {messageType: 'playTime', game: game.gameId};
            WebSocketService.sendToSingleClient(messagePlayTime, client);
            WebSocketService.sendToSingleClient(messagePlayTime, findClientByUserID(game.host, clients));
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

    getGameIdForPlayer : function(userId) {
        games.forEach(function (game) {
            if (game.host === userId || game.challenger === userId) {
                return game.gameId;
            }
        });
    }
};