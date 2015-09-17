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

    var getBoard = function(gameId){
        socket.send(JSON.stringify({"messageType" : "getBoard", gameId : gameId}));
    };

    var gameService = function(socketFactory) {
        socketFactory.getSocket(function (s){
            socket = s;
        });

        this.onMove = onMove;
        this.onWinner = onWinner;
        this.onDraw = onDraw;
        this.play = play;
        this.getInfo = getInfo;
        this.getBoard = getBoard;
    };

    angular.module("app").service("GameService", ["socketFactory", gameService])
})();