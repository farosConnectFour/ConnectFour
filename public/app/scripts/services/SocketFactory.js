/**
 * Created by peeteli on 14/09/2015.
 */

(function() {
    "use strict";

    var socket,
        connected = false;

    var getSocket = function(callback) {
        if (connected) {
            callback(socket);
        } else {
            socket = new SockJS('http://10.1.15.94:9998/chatbox');
            socket.onopen = function(){
                connected = true;
                callback(socket);
                console.log('connected');
            };
        }
    };

    var destroySocket = function(){
        socket = undefined;
        connected = false;
        console.log('disconnected');
    };

    var socketFactory = function() {
        console.log('opening socketFactory');

        this.getSocket = getSocket;
        this.destroySocket = destroySocket;

        return this;
    };

    angular.module("app").factory("socketFactory", [socketFactory])

})();