(function(){
    "use strict";
    var watchController = function($scope, $location, $routeParams, $interval, WatchService, GameService){
        var gameId = $routeParams.gameId;

        $scope.game = {};

        $scope.$on("involvedGameClosed", function(event, messageData){
            $interval(function(){
                $location.path("/lobby");
            },5000);
        });
        $scope.$on("$locationChangeStart",function(event, next, current){
            WatchService.stopWatching(gameId);
        });

        $scope.$on("boardInfo", function(event, messageData){
            $scope.game.board = messageData.game.game.board;
            $scope.game.currentPlayer = messageData.game.currentPlayer;
            $scope.$apply();
        });

        $scope.$on("movePlayed", function(event, messageData){
            $scope.game.board[messageData.result.row][messageData.result.col] = messageData.result.colour;
            $scope.game.currentPlayer = messageData.result.currentPlayer;
            $scope.game.winner = messageData.result.winner;
            $scope.$apply();
        });

        $scope.stopWatching = function(){
            WatchService.stopWatching(gameId);
            $location.path("/lobby");
        };

        GameService.getBoard(gameId);
    };
    angular.module("app").controller("WatchController", ["$scope","$location", "$routeParams", "$interval","WatchService", "GameService", watchController])
})();