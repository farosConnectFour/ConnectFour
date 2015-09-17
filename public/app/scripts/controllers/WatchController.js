(function(){
    "use strict";
    var watchController = function($scope, $location, $routeParams, $interval, WatchService){
        var gameId = $routeParams.gameId;
        $scope.$on("involvedGameClosed", function(event, messageData){
            $interval(function(){
                $location.path("/lobby");
            },5000);
        });
        $scope.$on("$locationChangeStart",function(event, next, current){
            WatchService.stopWatching(gameId);
        });
        $scope.stopWatching = function(){
            WatchService.stopWatching(gameId);
            $location.path("/lobby");
        }
    };
    angular.module("app").controller("WatchController", ["$scope","$location", "$routeParams", "$interval","WatchService", watchController])
})();