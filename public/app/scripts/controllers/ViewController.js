(function(){
    "use strict";
    var ViewController = function($scope,$location, socketFactory){
        $scope.games = [];

        $scope.$on("initGamesLoaded", function(event, messageData){
            $scope.games = messageData.games;
            $scope.$apply();
        });
        $scope.$on("gameCreated", function(event, messageData){
            var game = messageData.game;
            $scope.games.push(game);
            $scope.$apply();
        });
        $scope.$on("gameClosed", function(event, messageData){
            var gameIndex = undefined;
            angular.forEach($scope.games, function(scopeGame, index){
                if(scopeGame.gameId === messageData.game){
                    gameIndex = index;
                }
            });
            $scope.games.splice(gameIndex, 1);
            $scope.$apply();
        });
        $scope.$on("newWatcher", function(event, messageData){
            var watcherId = messageData.watcherId;
            $scope.games.forEach(function(game){
                if(game.gameId === messageData.gameId){
                    game.watchers.push(watcherId);
                }
            });
            $scope.$apply();
        });
        $scope.$on('watcherLeft', function(event, messageData){
            for(var i = 0; i < $scope.games.length; i++){
                if($scope.games[i].gameId == messageData.gameId){
                    $scope.games[i].watchers.splice($scope.games[i].watchers.indexOf(messageData.watcherId, 1));
                    break;
                }
            }
            $scope.$apply();
        });

        $scope.$on("watchTime", function(event, messageData){
            $location.path("/watch/" + messageData.gameId);
            $scope.$apply();
        });

        $scope.$on("gameStarted", function(event, messageData){
            var gameId = messageData.gameId;
            var challengerId = messageData.challengerId;
            angular.forEach($scope.games, function(game, index){
               if(game.gameId == gameId){
                   $scope.games[index].challenger = challengerId;
               }
            });
            $scope.$apply();
        });
        $scope.$on("playTime", function(event, messageData){
            $location.path("/game/" + messageData.game);
            $scope.$apply();
        });
    };

    angular.module("app").controller("ViewController", ["$scope","$location","socketFactory", ViewController]);
})();