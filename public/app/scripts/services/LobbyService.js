(function(){
    var LobbyService = function(){
        return {
            createGame: function(newGame){
                return {
                    gameId: 4,
                    name: newGame.name,
                    host: {
                        name: "Goldie",
                        points: 1650
                    },
                    challenger: null,
                    rated: newGame.rated,
                    watchers: []
                }
            },
            joinGame: function(gameId){
                //Vraag server als Current User game mag joinen, zoja return de challenger in json
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
                    new Game(1,"Game numero 1", 1, true),
                    new Game(2,"Game numero 2", 2, true),
                    new Game(3,"Game numero 3", 3, false),
                    new Game(4,"Game numero 4", 4, true),
                    new Game(5,"Game numero 5", 5, false)
                ];
            }
        }
    }

    angular.module("app").service("LobbyService", [LobbyService])
})();