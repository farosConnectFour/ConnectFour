/**
 * Created by peeteli on 14/09/2015.
 */

(function(){

    "use strict";

    var socket;
    var onReadyCallback;
    var currentUser;

    var onReady = function(callback){
        if(socket) {
            callback();
        } else {
            onReadyCallback = callback;
        }
    };

    var setUser = function(user){
        currentUser = user;
        socket.send(JSON.stringify({messageType: 'login', user: currentUser}));
    };

    var onMessage = function(callback){
        socket.onmessage = function(data){
            var messageData = JSON.parse(data.data);
            if(data.messageType === "login" || data.messageType === "privateMessage" || data.messageType === "initialLoad" || data.messageType === "message" || data.messageType === "logout"){
                callback(messageData);
            }
        }
    };

    var sendMessage = function(message){
        socket.send(JSON.stringify(message));
    };



    var chatboxService = function(socketFactory){

        var connect = function(){
            socketFactory.getSocket(function (s){
                socket = s;
                onReadyCallback();
            });
        };

        var disconnect = function(callback){
            socket.close();
            socketFactory.destroySocket();
            callback();

        };

        this.connect = connect;
        this.onReady = onReady;
        this.setUser = setUser;
        this.onMessage = onMessage;
        this.sendMessage = sendMessage;
        this.disconnect = disconnect;
    };

    angular.module("app").service("chatboxService", ["socketFactory", chatboxService])

})();
