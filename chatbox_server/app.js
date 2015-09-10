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

var clients = [];


chatbox.installHandlers(server, {prefix:'/chatbox'});
chatbox.on('connection', function(client){
    //adds this client to the clients list
    clients[client.id] = client;


    client.on('data', function(data) {
        var incomingData = JSON.parse(data);
        if(incomingData.messageType === 'login'){
            broadcast({messageType: 'login', user: incomingData.user, id: client.id});
        }
    });

    // on connection close event
    client.on('close', function() {
        delete clients[client.id];
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