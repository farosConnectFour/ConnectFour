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
        });

        for (var row = 0; row < 6; row++) {
            var cols = [];
            for (var col = 0; col < 7; col++) {
                cols.push(0);
            }
            board.push(cols);
        }


    };

    angular.module("app").controller("GameController", ["$scope", "$location","$interval", "$routeParams", "GameService", gameController])
})();