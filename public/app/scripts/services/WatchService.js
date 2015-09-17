(function(){
    var WatchService = function(socketFactory){

        var socket;

        socketFactory.getSocket(function(s){
            socket = s;
        });

        return {
            stopWatching: function(gameId){
                socket.send(JSON.stringify({"messageType" : "stopWatching", "gameId" : gameId}));
            }
        }
    }
    angular.module("app").service("WatchService", ["socketFactory", WatchService])
})();