(function(){
    "use strict";
    var ViewController = function($scope,$location){
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
            //TODO: plaats het watcherId van de nieuwe watcher bij de juiste game uit de $scope.games (haal de nodige data uit de messageData), voer nadien "$scope.$apply()" uit (wijziging in model via Socket behoort niet tot standaard angular digest loop, dus om wijzigingen zichtbaar te krijgen, moet je dit manueel aangeven.)
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
            //TODO: redirect naar "/watch/gameId", haal de gameId uit de messageData. voer nadien $scope.$apply() uit.
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

    angular.module("app").controller("ViewController", ["$scope","$location", ViewController]);
})();