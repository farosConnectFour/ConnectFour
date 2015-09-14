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
    rooms = [],
    currentRoomId = 1;

chatbox.installHandlers(server, {prefix:'/chatbox'});
chatbox.on('connection', function(client){
    //adds this client to the clients list
    clients[client.id] = client;

    client.on('data', function(data) {
        var incomingData = JSON.parse(data);
        if(incomingData.messageType === 'login'){
            client.user = incomingData.user;
            var connectedUser = new ConnectedUser(client.id, client.user.username, client.user.userId);
            storeConnectedUser(connectedUser);
            sendConnectedUsersToClient(client, connectedUsers);
            broadcast({messageType: 'login', user: connectedUser});
        } else if(incomingData.messageType === 'message'){
            broadcast({messageType: 'message', username: client.user.username, message: incomingData.message});
        } else if(incomingData.messageType === 'privateMessage'){
            findClientByUsername(incomingData.receiver).write(JSON.stringify({messageType: 'privateMessage', sender: incomingData.sender, receiver: incomingData.receiver, message: incomingData.message}));
            (clients[client.id].write(JSON.stringify({messageType: 'privateMessage', sender: incomingData.sender, receiver: incomingData.receiver, message: incomingData.message})));
        }else if(incomingData.messageType === "createGame"){
            var newGame = new Game(currentRoomId,incomingData.game.name,client.user.id,null,incomingData.game.rated, []);
            currentRoomId++;
            rooms.push(newGame);
            broadcast({messageType: "gameCreated", game: newGame});
        }
    });

    // on connection close event
    client.on('close', function() {
        


        storeDisconnectedUser(client.user.username);
        delete clients[client.id];
        broadcast({messageType: 'logout', username: client.user.username});
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
        connectedUsers.splice(index, 1);
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
        if(clients[client].user.username === username){
            return clients[client];
        }
    }
    return undefined;
}

server.listen(9998, function(){
    console.log("Listening on port 9998");
});