(function(){
    "use strict";
    var watchController = function($scope, $location, WatchService, GameService){
        //TODO: haal het gameId op via $routeParams, injecteer deze dependency ook! (Dit zorgt ervoor dat bij het watchen van een game ook het juiste bord wordt opgevraagd
        var gameId = $routeParams.gameId;

        $scope.game = {};

        $scope.$on("involvedGameClosed", function(event, messageData){
            //TODO: redirect na 5 seconden naar '/lobby', gebruik hiervoor $interval (injecteer deze dependency ook!) zorg voor maar 1 herhaling!
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
    angular.module("app").controller("WatchController", ["$scope","$location","WatchService", "GameService", watchController])
})();