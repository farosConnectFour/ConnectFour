/**
 * Created by peeteli on 4/09/2015.
 */

var express = require('express'),
    app = express(),
    http = require('http'),
    sockjs = require('sockjs'),
    chatbox = sockjs.createServer({sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js'}),
    server = http.createServer();
    //server = require('http').createServer(app),
    //io = require('socket.io')(server);

var clients = {},
    connectedUsers = [];


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


//var connectedUsers = [],
//    storeConnectedUser = function(user){
//        connectedUsers.push(user);
//    },
//    storeDisconnectedUser = function(username){
//        connectedUsers.splice(getIndexConnectedUserByUsername(username), 1);
//    },
//    getIndexConnectedUserByUsername = function(username){
//        for(var i = 0; i < connectedUsers.length; i++){
//            if(connectedUsers[i].username === username){
//                return i;
//            }
//        }
//        return undefined;
//    };


//io.on('connection', function(client){
//    client.on('join', function(username){
//        client.username = username;
//        storeConnectedUser({username: username, id: client.id, messages: []});
//        client.broadcast.emit('addChatter', {username: username, id: client.id, messages: []});
//        client.emit('initialLoad', {users: connectedUsers, messages: []});
//    });
//    client.on('disconnect', function(){
//        storeDisconnectedUser(client.username);
//        client.broadcast.emit('removeChatter', client.username);
//    });
//    client.on('sendMessage', function(message){
//        client.broadcast.emit('newMessage', {sender: client.username, message: message});
//        client.emit('newMessage', {sender: client.username, message: message});
//    });
//    client.on('sendPrivateMessage', function(data){
//        client.emit('newPrivateMessage', {sender: client.username, receiver: data.receiver.username, message: data.message});
//        client.to(data.receiver.id).emit('newPrivateMessage', {sender: client.username, receiver: data.receiver.username, message: data.message});
//    });
//});

server.listen(9998, function(){
    console.log("Listening on port 9998");
});