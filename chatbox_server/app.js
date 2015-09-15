/**
 * Created by peeteli on 4/09/2015.
 */

var express = require('express'),
    app = express(),
    http = require('http'),
    sockjs = require('sockjs'),
    chatbox = sockjs.createServer({sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js'}),
    server = http.createServer();

var clients = {},
    connectedUsers = [],
    games = [
        new Game(1,"Game numero 1", 1, null, true, []),
        new Game(2,"Game numero 2", 2, null, true, []),
        new Game(3,"Game numero 3", 3, null, false, []),
        new Game(4,"Game numero 4", 4, null, true, []),
        new Game(5,"Game numero 5", 5, null, false, [2])
    ],
    currentGameId = 6;

chatbox.installHandlers(server, {prefix:'/chatbox'});
chatbox.on('connection', function(client){
    //adds this client to the clients list
    clients[client.id] = client;

    client.on('data', function(data) {
        var incomingData = JSON.parse(data);
        if(incomingData.messageType === 'login'){
            client.user = incomingData.user;
            var connectedUser = new ConnectedUser(client.id, client.user.username, client.user.id);
            storeConnectedUser(connectedUser);
            sendConnectedUsersToClient(client, connectedUsers);
            broadcast({messageType: 'login', user: connectedUser});
        } else if(incomingData.messageType === 'message'){
            broadcast({messageType: 'message', username: client.user.username, message: incomingData.message});
        } else if(incomingData.messageType === 'privateMessage'){
            findClientByUsername(incomingData.receiver).write(JSON.stringify({messageType: 'privateMessage', sender: incomingData.sender, receiver: incomingData.receiver, message: incomingData.message}));
            clients[client.id].write(JSON.stringify({messageType: 'privateMessage', sender: incomingData.sender, receiver: incomingData.receiver, message: incomingData.message}));
        } else if(incomingData.messageType === "createGame") {
            if (clientIsChallenging(client.user.id) || clientAlreadyHosting(client.user.id)) {
                clients[client.id].write(JSON.stringify({messageType: 'error', error: "you are already hosting or playing, so you cant create a new Game!"}));
            } else {
                var newGame = new Game(currentGameId, incomingData.game.name, client.user.id, null, incomingData.game.rated, []);
                currentGameId++;
                games.push(newGame);
                broadcast({messageType: "gameCreated", game: newGame});
            }
        } else if(incomingData.messageType === "initLoadGames"){
            client.write(JSON.stringify({messageType: 'initGamesLoaded', "games" : games }));
        } else if(incomingData.messageType === "close"){
            storeDisconnectedUser(client.user.username);
            checkActiveGamesDisconnectedUser(client);
            broadcast({messageType: 'logout', username: client.user.username});
            client.user = null;
        } else if(incomingData.messageType === "joinGame"){
            if (clientIsChallenging(client.user.id)) {
                clients[client.id].write(JSON.stringify({messageType: 'error', error: "you are already playing, So you cannot play in another"}));
            } else {
                var game = setGameChallenger(incomingData.gameId, client.user.id);
                var roomToDelete = closeEventualHostedGames(client.user.id);
                if(roomToDelete != null){
                    broadcast({messageType: 'gameClosed', game: roomToDelete});
                }
                client.write(JSON.stringify({messageType: 'playTime', game: game}));
                findClientByUserID(game.host).write(JSON.stringify({messageType: 'playTime', game: game}));
            }
        }
    });

    // on connection close event
    client.on('close', function() {
        delete clients[client.id];
        checkActiveGamesDisconnectedUser(client)
        if(client.user){
            storeDisconnectedUser(client.user.username);
            broadcast({messageType: 'logout', username: client.user.username});
        }
    });

});

// Broadcast to all clients
function broadcast(message){
    // iterate through each client in clients object
    for (var client in clients){
        // send the message to that client
        clients[client].write(JSON.stringify(message));
    }
}

function sendConnectedUsersToClient(client, users){
    var message = {messageType: 'initialLoad', connectedUsers: users};
    client.write(JSON.stringify(message));
}

function storeConnectedUser(user){
    connectedUsers.push(user);
}

function storeDisconnectedUser(username){
    var index = getIndexConnectedUserByUsername(username);
    if(index > -1){
        connectedUsers.splice(getIndexConnectedUserByUsername(username), 1);
    }
}

function getIndexConnectedUserByUsername(username){
    for(var i = 0; i < connectedUsers.length; i++){
        if(connectedUsers[i].username === username){
            return i;
        }
    }
    return undefined;
}

function ConnectedUser(clientId, username, userId){
    this.clientId = clientId;
    this.username = username;
    this.userId = userId;
}

function Game(gameId, name, host, challenger, rated, watchers){
    this.gameId = gameId;
    this.name = name;
    this.host = host;
    this.rated = rated;
    this.challenger = challenger;
    this.watchers = watchers;
}

function findClientByUsername(username){
    for (var client in clients){
        if(clients[client].user && clients[client].user.username === username){
            return clients[client];
        }
    }
    return undefined;
}

function findClientByUserID(id){
    for (var client in clients){
        if(clients[client].user && clients[client].user.id === id){
            return clients[client];
        }
    }
    return undefined;
}

function checkActiveGamesDisconnectedUser(client){
    console.log(games);
    var gamesToDelete = [];
    games.forEach(function(game){
        if(game.host === client.user.id){
            console.log("Game to delete because host resigns: " + game.gameId);
            gamesToDelete.push(game.gameId);
            if(game.challenger){
                //TODO: catch this message front-end
                findClientByUserID(game.challenger).write(JSON.stringify({messageType: 'opponentResigned'}));
            }
        } else if(game.challenger === client.user.id){
            console.log("Game to delete because challenger resigns: " + game.gameId);
            gamesToDelete.push(game.gameId);
            //TODO: catch this message front-end
            findClientByUserID(game.host).write(JSON.stringify({messageType: 'opponentResigned'}))
        } else if(game.watchers.indexOf(client.user.id) > -1){
            console.log("Watcher to delete in game: " + game.gameId);
            game.watchers.splice(game.watchers.indexOf(client.user.id), 1);
            //TODO: catch this message front-end
            broadcast({messageType: 'watcherLeft', game: game.gameId, watcher: client.user})
        }
    });
    gamesToDelete.forEach(function(index){
        for(var i = 0; i < games.length; i++){
            if(games[i].gameId === index){
                broadcast({messageType: 'gameClosed', game: games[i].gameId});
                games.splice(i, 1);
            }
        }
    });
}

server.listen(9998, function(){
    console.log("Listening on port 9998");
});

function clientIsChallenging(clientUserId){
    for(var i = 0 ; i < games.length ; i++){
        if(games[i].challenger == clientUserId){
            console.log("Client " + clientUserId + " is already challenging in a game.")
            return true;
        }
    }
    return false;
};

function clientAlreadyHosting(clientUserId){
    for(var i = 0 ; i < games.length ; i++){
        if(games[i].host == clientUserId){
            console.log("Client " + clientUserId + " is already hosting a game.")
            return true;
        }
    }
    return false;
};
function findGameByGameId(gameId){
    for(var i = 0 ; i < games.length ; i++){
        if(games[i].gameId === gameId){
            return games[i];
        }
    }
};
function closeEventualHostedGame(clientUserId){
    for(var i = games.length -1 ; i >= 0  ; i--){
        if(games[i].host === clientUserId){
            var gameId = games[i].gameId;
            games.splice(i, 1);
            return gameId;
        }
    }
    return null;
};

function setGameChallenger(gameId, clientUserId){
    for(var i = 0 ; i < games.length ; i++){
        if(games[i].gameId === gameId){
            games[i].challenger = clientUserId;
            return games[i];
        }
    }
}
