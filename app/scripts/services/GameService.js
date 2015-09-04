(function(){
    var GameService = function(){
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
            }
        }
    }

    angular.module("app").service("GameService", [GameService])
})();