(function(){

    var gameController = function($rootScope, $scope, $location, $interval, $routeParams, GameService ) {
        "use strict";

        var board = [];
        var gameId = $routeParams.gameId;

        $scope.game = {};

        $scope.$on("involvedGameClosed", function(){
            $interval(function(){
                $location.path("/lobby");
            },5000, 1);
        });

        $scope.$on("boardInfo", function(event, messageData){
            $scope.game.board = messageData.game.game.board;
            $scope.game.currentPlayer = messageData.game.currentPlayer;
            $scope.game.myTurn = isMyTurn(messageData.game.currentPlayer);
            $scope.$apply();
        });

        $scope.$on("movePlayed", function(event, messageData){
            $scope.game.board[messageData.result.row][messageData.result.col] = messageData.result.colour;
            $scope.game.currentPlayer = messageData.result.currentPlayer;
            $scope.game.winner = messageData.result.winner;
            $scope.game.myTurn = isMyTurn(messageData.result.currentPlayer);
            $scope.$apply();
        });



        $scope.game.play = function(col){
            if(isMyTurn($scope.game.currentPlayer)) {
                GameService.play(gameId, col);
            }
        };

        GameService.getBoard(gameId);


        function isMyTurn(currentPlayer){
            return currentPlayer === $rootScope.currentUser.id;
        }


    };

    angular.module("app").controller("GameController", ["$rootScope", "$scope", "$location","$interval", "$routeParams", "GameService", gameController])
})();