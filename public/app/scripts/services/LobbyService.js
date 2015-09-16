(function(){
    var LobbyService = function(socketFactory){

        var socket;

        socketFactory.getSocket(function(s){
            socket = s;
        });

        return {
            createGame: function(newGame){
                socket.send(JSON.stringify({"messageType" : "createGame", "game" : newGame}));
            },
            joinGame: function(gameId){
                socket.send(JSON.stringify({"messageType" : "joinGame", "gameId" : gameId}));
            },
            watchGame: function(gameId){
                //Vraag server als Current User game mag bekijken. Zoja return watcher
                return {
                    name: "Watcher",
                    points: 1100
                }
            },
            getGames: function(){
                socket.send(JSON.stringify({"messageType" : "initLoadGames"}));
            }
        }
    }

    angular.module("app").service("LobbyService", ["socketFactory", LobbyService])
})();