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

    var resign = function(gameId){
        socket.send(JSON.stringify({"messageType" : "resign", gameId: gameId}));
    };

    var gameService = function(socketFactory) {
        socketFactory.getSocket(function (s){
            socket = s;
        });

        this.getBoard = getBoard;
        this.play = play;
        this.resign = resign;
    };

    angular.module("app").service("GameService", ["socketFactory", gameService])
})();
