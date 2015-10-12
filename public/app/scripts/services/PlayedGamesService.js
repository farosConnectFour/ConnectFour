(function(){
    "use strict";
    var PlayedGamesService = function(){
        var getLast3Games = function(){
            //TODO: haal de laatste 3 games op via een REST-call. Doe een $http.get naar xxx.xxx.xxx.xxx:8080/connectfour/api/games ($http-dependency injecteren!)
            //TODO: get-call geeft een promise terug, verwerk deze en zet response-body om naar een array. Deze array van 3 games is wat de fuctie returned.
            return [];
        };
        return {
            getLast3Games: getLast3Games
        };
    };
    angular.module("app").service("PlayedGamesService", PlayedGamesService);
})();