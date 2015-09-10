(function(){
    "use strict";
    var UserService = function($http){
        var getAllPlayers = function(){
            return $http.get("http://10.1.15.60:8080/connectfour/api/users").then(function(response){
                var players = [];
                angular.forEach(response.data, function(value){
                    players.push(new Player(value.userId, value.name, value.points));
                });
                return players;
            });
        };
        return {
            getAllPlayers: getAllPlayers
        };
    };
    angular.module("app").service("UserService", ["$http", UserService]);
})();