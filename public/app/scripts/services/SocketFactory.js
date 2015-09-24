/**
 * Created by peeteli on 14/09/2015.
 */

(function() {
    "use strict";

    var socket;


    var getSocket = function(callback) {
        if (socket) {
            callback(socket);
        } else {
            socket = new SockJS('http://10.1.15.60:9998/contentSocket');
            socket.onopen = function(){
                callback(socket);
                console.log('connected');
            };
        }
    };

    var destroySocket = function(){
        socket = undefined;
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