(function(){
    "use strict";
    var PlayedGamesService = function($http){
        var getLast5Games = function(){
            return $http.get("http://localhost:8080/connectfour/api/games").then(function(response){
                var games = [];
                angular.forEach(response.data, function(value){
                    games.push(new PlayedGame(value.gameId, value.player1, value.player2, value.winner, value.rated));
                });
                return games;
            });
        };
        return {
            getLast5Games: getLast5Games
        };
    };
    angular.module("app").service("PlayedGamesService", ["$http", PlayedGamesService]);
})();