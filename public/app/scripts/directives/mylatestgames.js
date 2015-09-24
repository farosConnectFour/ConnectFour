(function(){
    "use strict";
    angular.module("app").directive("myLatestGames",function(){
        return {
            restrict: 'E',
            scope: {},
            templateUrl: "views/latestgames.html",
            controller: "LatestGamesController"
        }
    });
})();