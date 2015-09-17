//Private
var WebSocketService = require("./WebSocketService.js");
var ConnectedUser = require("../models/ConnectedUser.js");

var connectedUsers = [];

function storeDisconnectedUser(disconnectedUser) {
    for (var i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[i].userId === disconnectedUser.id) {
            connectedUsers.splice(i, 1);
            break;
        }
    }
}

//Public

var self = module.exports = {
    connectUser: function (clientConnected, clients) {
        var connectedUser = new ConnectedUser(clientConnected.id, clientConnected.user.username, clientConnected.user.id);
        connectedUsers.push(connectedUser);
        var initialLoadMessage = {messageType: 'initialLoad', connectedUsers: connectedUsers};
        WebSocketService.sendToSingleClient(initialLoadMessage, clientConnected);
        var messageConnectedUser = {messageType: 'login', user: connectedUser};
        WebSocketService.broadcast(messageConnectedUser, clients);
    },

    broadcastMessage: function (client, clients, messageSent) {
        var message = {messageType: 'message', username: client.user.username, message: messageSent};
        WebSocketService.broadcast(message, clients);
    },

    sendPrivateMessage: function (receiver, sender, messageSent) {
        var message = {
            messageType: 'privateMessage',
            sender: sender.user.username,
            receiver: receiver.user.username,
            message: messageSent
        };
        WebSocketService.sendToSingleClient(message, receiver);
        WebSocketService.sendToSingleClient(message, sender)
    },

    logUserOut: function (loggedOutClient, clients) {
        storeDisconnectedUser(loggedOutClient.user);
        var message = {messageType: 'logout', username: loggedOutClient.user.username};
        WebSocketService.broadcast(message, clients);
    }
};



