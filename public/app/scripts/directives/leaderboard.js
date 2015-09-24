(function(){
    "use strict";
    angular.module("app").directive("myLeaderboard", function(){
        return {
            restrict: 'E',
            scope: {
                players: "="
            },
            templateUrl: "views/leaderboard.html",
            controller: "LeaderBoardController"
        }
    });
})();