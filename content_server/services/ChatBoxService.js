var WebSocketService = new (require("./WebSocketService.js"))();
var ConnectedUser = require("../models/ConnectedUser.js");

function ChatBoxService(){
    this.connectedUsers = [];
};

ChatBoxService.prototype.connectUser = function(clientConnected, clients){
    var connectedUser = new ConnectedUser(clientConnected.id, clientConnected.user.username, clientConnected.user.id);
    this.connectedUsers.push(connectedUser);
    var initialLoadMessage = {messageType: 'initialLoad', connectedUsers: this.connectedUsers};
    WebSocketService.sendToSingleClient(initialLoadMessage, clientConnected);
    var messageConnectedUser = {messageType: 'login', user: connectedUser};
    WebSocketService.broadcast(messageConnectedUser, clients);
};

ChatBoxService.prototype.storeDisconnectedUser = function(disconnectedUser){
    var index = this.connectedUsers.indexOf(disconnectedUser);
    if(index > -1){
        this.connectedUsers.splice(index, 1);
    }
};

ChatBoxService.prototype.broadcastMessage = function(client, clients, messageSent){
    var message = {messageType: 'message', username: client.user.username, message: messageSent};
    WebSocketService.broadcast(message, clients);
};

ChatBoxService.prototype.sendPrivateMessage = function(receiver,sender, messageSent){
    var message = {messageType: 'privateMessage', sender: sender.user.username, receiver: receiver.user.username, message: messageSent};
    WebSocketService.sendToSingleClient(message, receiver);
    WebSocketService.sendToSingleClient(message, sender)
};

ChatBoxService.prototype.logUserOut = function(loggedOutClient, clients){
    this.storeDisconnectedUser(loggedOutClient.user);
    var message = {messageType: 'logout', username: loggedOutClient.user.username};
    WebSocketService.broadcast(message, clients);
};


module.exports = ChatBoxService;


