/**
 * Created by nijstom on 2/04/2015.
 */

(function () {
    "use strict";

    var socket;

    var getBoard = function(gameId){
        socket.send(JSON.stringify({"messageType" : "getBoard", gameId : gameId}));
    };

    var play = function(gameId, col) {
        socket.send(JSON.stringify({"messageType" : "makeAMove", gameId : gameId, column: col}));
    };

    var gameService = function(socketFactory) {
        socketFactory.getSocket(function (s){
            socket = s;
        });

        this.getBoard = getBoard;
        this.play = play;
    };

    angular.module("app").service("GameService", ["socketFactory", gameService])
})();

//var getInfo = function( callback) {
//    socket.on('info', callback);
//    socket.emit('info');
//};
//
//var onMove = function (callback) {
//    socket.on('move', function (data) {
//        callback(data);
//    });
//};
//var onWinner = function (callback) {
//    socket.on('winner', callback);
//};
//
//var onDraw = function(callback) {
//    socket.on('draw', callback);
//};