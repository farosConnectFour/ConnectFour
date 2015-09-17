

//Private
var WebSocketService = new (require("./WebSocketService.js"))();
var Game = require("../models/Game.js");

var games = [],
    currentGameId = 0;

function clientIsChallenging(clientUserId){
    for(var i = 0 ; i < games.length ; i++){
        if(games[i].challenger == clientUserId){
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
                    games.splice(i, 1);
                    var messageGameClosed = {messageType: 'gameClosed', game: games[i].gameId};
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
        this.games.forEach(function(game){
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







//
//function GameService(){
//    this.games = [];
//    this.currentGameId = 0;
//
//    this.clientIsChallenging = function(clientUserId){
//        for(var i = 0 ; i < this.games.length ; i++){
//            if(this.games[i].challenger == clientUserId){
//                return true;
//            }
//        }
//        return false;
//    };
//    this.clientAlreadyHosting = function(clientUserId){
//        for(var i = 0 ; i < this.games.length ; i++){
//            if(this.games[i].host == clientUserId){
//                return true;
//            }
//        }
//        return false;
//    };
//    this.findClientByUserID = function(userId, clients){
//        for (var client in clients){
//            if(clients[client].user && clients[client].user.id === userId){
//                return clients[client];
//            }
//        }
//        return -1;
//    };
//    this.hostTriesToJoinOwnGame = function(client, gameId){
//        for(var i = 0 ; i < this.games.length ; i++){
//            if(this.games[i].gameId === gameId){
//                return this.games[i].host === client.user.id;
//            }
//        }
//    };
//    this.setGameChallenger = function(gameId, clientUserId){
//        for(var i = 0 ; i < this.games.length ; i++){
//            if(this.games[i].gameId === gameId){
//                this.games[i].challenger = clientUserId;
//                return this.games[i];
//            }
//        }
//    };
//    this.closeHostedGames = function(clientUserId){
//        for(var i = this.games.length -1 ; i >= 0  ; i--){
//            if(this.games[i].host === clientUserId){
//                var gameId = this.games[i].gameId;
//                this.games.splice(i, 1);
//                return gameId;
//            }
//        }
//        return null;
//    };
//}
//
//GameService.prototype.createGame = function(client, clients, game){
//    if (this.clientIsChallenging(client.user.id) || this.clientAlreadyHosting(client.user.id)) {
//        var message = {messageType: 'error', error: "You are already hosting or playing, so you cant create a new Game!"};
//        WebSocketService.sendToSingleClient(message, client);
//    } else {
//        var newGame = new Game(this.currentGameId, game.name, client.user.id, null, game.rated, []);
//        this.currentGameId++;
//        this.games.push(newGame);
//        var messageNewGame = {messageType: "gameCreated", game: newGame};
//        WebSocketService.broadcast(messageNewGame, clients);
//
//        ConnectFourService.setTestWord('gameCreated');
//
//        //return newGame.gameId;
//    }
//};
//
//GameService.prototype.loadGames = function(client){
//    var message = {messageType: 'initGamesLoaded', games : this.games };
//    WebSocketService.sendToSingleClient(message, client);
//};
//
//GameService.prototype.removeUserFromGames = function(client, clients){
//    var gamesToDelete = [];
//    this.games.forEach(function(game){
//        var messageResigned = {messageType: 'playerResigned', player: client.user};
//        if(game.host === client.user.id){
//            gamesToDelete.push(game.gameId);
//            if(game.challenger){
//                WebSocketService.sendToSingleClient(messageResigned, this.findClientByUserID(game.challenger));
//                game.watchers.forEach(function(watcherId){
//                    WebSocketService.sendToSingleClient(messageResigned, this.findClientByUserID(watcherId));
//                });
//            }
//        } else if(game.challenger === client.user.id){
//            gamesToDelete.push(game.gameId);
//            WebSocketService.sendToSingleClient(messageResigned, this.findClientByUserID(game.host));
//            game.watchers.forEach(function(watcherId){
//                WebSocketService.sendToSingleClient(messageResigned, this.findClientByUserID(watcherId));
//            });
//        } else if(game.watchers.indexOf(client.user.id) > -1){
//            game.watchers.splice(game.watchers.indexOf(client.user.id), 1);
//            var messageWatcherLeft = {messageType: 'watcherLeft', game: game.gameId, watcher: client.user};
//            WebSocketService.broadcast(messageWatcherLeft, clients);
//        }
//    });
//    gamesToDelete.forEach(function(index){
//        for(var i = 0; i < this.games.length; i++){
//            if(this.games[i].gameId === index){
//                this.games.splice(i, 1);
//                var messageGameClosed = {messageType: 'gameClosed', game: this.games[i].gameId};
//                WebSocketService.broadcast(messageGameClosed, clients);
//            }
//        }
//    });
//};
//
//GameService.prototype.joinGame = function(client, clients, gameId){
//    if (this.clientIsChallenging(client.user.id)) {
//        var messageErrorChallenging = {messageType: 'error', error: "you are already playing, So you cannot play in another"};
//        WebSocketService.sendToSingleClient(messageErrorChallenging, client);
//    } else if(this.hostTriesToJoinOwnGame(client, gameId)){
//        var messageErrorHost = {messageType: 'error', error: "You obviously can't join your own game... !!!"};
//        WebSocketService.sendToSingleClient(messageErrorHost, client);
//    } else {
//        var game = this.setGameChallenger(gameId, client.user.id);
//        var messageUpdateRoom = {messageType: 'updateRoom', game: game};
//        WebSocketService.broadcast(messageUpdateRoom, clients);
//
//        var roomToDelete = this.closeHostedGames(client.user.id);
//        if(roomToDelete != null){
//            var messageDeleteRoom = {messageType: 'gameClosed', game: roomToDelete}
//            WebSocketService.broadcast(messageDeleteRoom, clients);
//        }
//
//        var messagePlayTime = {messageType: 'playTime', game: game.gameId};
//        WebSocketService.sendToSingleClient(messagePlayTime, client);
//        WebSocketService.sendToSingleClient(messagePlayTime, this.findClientByUserID(game.host, clients));
//    }
//};
//
//GameService.prototype.getGameIdForPlayer = function(userId){
//    console.log('getting gameId for: ' + userId);
//    console.log(this.games);
//    this.games.forEach(function(game){
//        if(game.host === userId || game.challenger === userId){
//            return game.gameId;
//        }
//    });
//};
//
//module.exports = GameService;