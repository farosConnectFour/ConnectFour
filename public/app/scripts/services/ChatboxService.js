/**
 * Created by peeteli on 14/09/2015.
 */

(function(){

    "use strict";

    var socket;
    var currentUser;

    var setUser = function(user){
        currentUser = user;
        socket.send(JSON.stringify({messageType: 'login', user: currentUser}));
    };

    var sendMessage = function(message){
        socket.send(JSON.stringify(message));
    };

    var chatboxService = function(socketFactory){
        socketFactory.getSocket(function (s){
            socket = s;
        });

        var disconnect = function(callback){
            socket.send(JSON.stringify({"messageType" : "close"}));
            callback();
        };

        this.setUser = setUser;
        this.sendMessage = sendMessage;
        this.disconnect = disconnect;
    };

    angular.module("app").service("chatboxService", ["socketFactory", chatboxService])

})();
