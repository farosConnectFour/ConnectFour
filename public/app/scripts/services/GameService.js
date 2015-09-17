/**
 * Created by nijstom on 2/04/2015.
 */

(function () {
    "use strict"

    var socket;

    var onMove = function (callback) {
        socket.on('move', function (data) {
            callback(data);
        });
    };
    var onWinner = function (callback) {
        socket.on('winner', callback);
    };

    var onDraw = function(callback) {
        socket.on('draw', callback);
    };

    var play = function(col) {
        socket.emit('move', col);
    };

    var getInfo = function( callback) {
        socket.on('info', callback);
        socket.emit('info');
    };

    var gameService = function(socketFactory) {
        var self = this;

        socketFactory.getSocket(function (s){
            socket = s;
        });

        this.onReady = onReady;
        this.onMove = onMove;
        this.onWinner = onWinner;
        this.onDraw = onDraw;
        this.play = play;
        this.getInfo = getInfo;
    };

    angular.module("app").service("GameService", ["socketFactory", gameService])
})();