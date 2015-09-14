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
            client.username = incomingData.user;
            var connectedUser = new ConnectedUser(client.id, client.username)
            storeConnectedUser(connectedUser);
            sendConnectedUsersToClient(client, connectedUsers);
            broadcast({messageType: 'login', user: connectedUser});
        } else if(incomingData.messageType === 'message'){
            broadcast({messageType: 'message', username: client.username, message: incomingData.message});
        } else if(incomingData.messageType === 'privateMessage'){
            findClientByUsername(incomingData.receiver.username).write(JSON.stringify({messageType: 'privateMessage', sender: incomingData.sender, receiver: incomingData.receiver.username, message: incomingData.message}));
            (clients[client.id].write(JSON.stringify({messageType: 'privateMessage', sender: incomingData.sender, receiver: incomingData.receiver.username, message: incomingData.message})));
        } else if(incomingData.messageType === "createGame"){
            var newGame = new Game(currentRoomId,incomingData.game.name,client.user.id,null,incomingData.game.rated, []);
            currentRoomId++;
            rooms.push(newGame);
            broadcast({messageType: "gameCreated", game: newGame});
        }
    });

    // on connection close event
    client.on('close', function() {
        storeDisconnectedUser(client.username);
        delete clients[client.id];
        broadcast({messageType: 'logout', username: client.username});
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
    connectedUsers.splice(getIndexConnectedUserByUsername(username), 1);
}

function getIndexConnectedUserByUsername(username){
    for(var i = 0; i < connectedUsers.length; i++){
        if(connectedUsers[i].username === username){
            return i;
        }
    }
    return undefined;
}

function ConnectedUser(id, username){
    this.id = id;
    this.username = username;
}

function findClientByUsername(username){
    for (var client in clients){
        if(clients[client].username === username){
            return clients[client];
        }
    }
    return undefined;
}

server.listen(9998, function(){
    console.log("Listening on port 9998");
});