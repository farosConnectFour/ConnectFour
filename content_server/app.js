/**
 * Created by peeteli on 4/09/2015.
 */
var ChatBoxService = require("./services/ChatBoxService.js");
var GameService = require("./services/GameService.js");
var ConnectFourService = require("./services/ConnectFourService.js");

var express = require('express'),
    app = express(),
    http = require('http'),
    sockjs = require('sockjs'),
    contentSocket = sockjs.createServer({sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js'}),
    server = http.createServer();

var clients = {};

contentSocket.installHandlers(server, {prefix:'/contentSocket'});
contentSocket.on('connection', function(client){
    //adds this client to the clients list
    clients[client.id] = client;

    client.on('data', function(data) {
        var incomingData = JSON.parse(data);
        if(incomingData.messageType === 'login'){
            client.user = incomingData.user;
            ChatBoxService.connectUser(client, clients);
        } else if(incomingData.messageType === "logout"){
            ChatBoxService.logUserOut(client, clients);
            GameService.removeUserFromGames(client, clients);
            client.user = null;
        } else if(incomingData.messageType === 'message'){
            ChatBoxService.broadcastMessage(client, clients, incomingData.message);
        } else if(incomingData.messageType === 'privateMessage'){
            var receiver = findClientByUsername(incomingData.receiver);
            ChatBoxService.sendPrivateMessage(receiver, client, incomingData.message);
        } else if(incomingData.messageType === "createGame") {
            GameService.createGame(client, clients, incomingData.game);
        } else if(incomingData.messageType === "initLoadGames"){
            GameService.loadGames(client);
        }  else if(incomingData.messageType === "joinGame"){
            GameService.joinGame(client, clients, incomingData.gameId);
        } else if(incomingData.messageType === "getBoard"){
            ConnectFourService.getGame(client, incomingData.gameId);
        } else if(incomingData.messageType === "watchGame"){
            GameService.watchGame(client, clients, incomingData.gameId);
        }
    });

    // on connection close event
    client.on('close', function() {
        delete clients[client.id];
        GameService.removeUserFromGames(client, clients);
        if(client.user){
            ChatBoxService.logUserOut(client, clients);
        }
    });
});

function findClientByUsername(username){
    for (var client in clients){
        if(clients[client].user && clients[client].user.username === username){
            return clients[client];
        }
    }
    return undefined;
}


server.listen(9998, function(){
    console.log("Listening on port 9998");
});
