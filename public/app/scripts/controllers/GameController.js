(function(){
    var gameController = function($scope, $location, $interval, $routeParams, GameService ) {
        "use strict";

        var board = [];
        var gameId = $routeParams.gameId;

        $scope.$on("involvedGameClosed", function(event, messageData){
            $interval(function(){
                $location.path("/lobby");
            },5000);
        });

        GameService.getBoard(gameId);

        $scope.$on("boardInfo", function(event, messageData){
            $scope.game = {board: messageData.game.game.board, currentPlayer: messageData.game.currentPlayer};
            $scope.$apply();
        });
    };

    angular.module("app").controller("GameController", ["$scope", "$location","$interval", "$routeParams", "GameService", gameController])
})();