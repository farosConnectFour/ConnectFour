(function(){
    var LobbyService = function(socketFactory){

        var socket;

        socketFactory.getSocket(function(s){
            socket = s;
        });

        return {
            createGame: function(newGame, callback){
                socket.send(JSON.stringify({"messageType" : "createGame", "game" : newGame}));
                socket.onmessage = function(data){
                    var messageData = JSON.parse(data.data);
                    if(messageData.messageType === "gameCreated"){
                        callback(messageData);
                    }
                };
            },
            joinGame: function(gameId){
                return {
                    name: "Challenger",
                    points: 1100
                }
            },
            watchGame: function(gameId){
                //Vraag server als Current User game mag bekijken. Zoja return watcher
                return {
                    name: "Watcher",
                    points: 1100
                }
            },
            getGames: function(){
                return [
                    new Game(1,"Game numero 1", 1, null, true, []),
                    new Game(2,"Game numero 2", 2, null, true, []),
                    new Game(3,"Game numero 3", 3, null, false, []),
                    new Game(4,"Game numero 4", 4, null, true, []),
                    new Game(5,"Game numero 5", 5, null, false, [])
                ];
            }
        }
    }

    angular.module("app").service("LobbyService", ["socketFactory", LobbyService])
})();