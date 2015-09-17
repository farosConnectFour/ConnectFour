(function(){
    var lobbyController = function($scope, $modal, $location, LobbyService){
        $scope.games = [];
        $scope.$on("initGamesLoaded", function(event, messageData){
            $scope.games = messageData.games;
            $scope.$apply();
        });
        var createGameListener = $scope.$on("gameCreated", function(event, messageData){
            var game = messageData.game;
            $scope.games.push(game);
            $scope.$apply();
        });
        var playtimeListener = $scope.$on("playTime", function(event, messageData){
            $location.path("/game/" + messageData.game);
            $scope.$apply();
        });
        var updateRoomListener = $scope.$on("updateRoom", function(event, messageData){
            var messageDataGame = messageData.game;
            angular.forEach($scope.games, function(game, index){
                if(game.gameId == messageData.game.gameId){
                    $scope.games[index] = messageDataGame;
                }
            });
            $scope.$apply();
        });

        var closeGameListener = $scope.$on("gameClosed", function(event, messageData){
            var gameIndex = undefined;
            angular.forEach($scope.games, function(scopeGame, index){
               if(scopeGame.gameId === messageData.game){
                   gameIndex = index;
               }
            });
            $scope.games.splice(gameIndex, 1);
            $scope.$apply();
        });

        var watcherLeftListener = $scope.$on('watcherLeft', function(event, messageData){
            for(var i = 0; i < $scope.games.length; i++){
                if($scope.games[i].gameId == messageData.game){
                    $scope.games[i].watchers.splice($scope.games[i].watchers.indexOf(messageData.watcher.id, 1));
                    break;
                }
            }
            $scope.$apply();
        });

        LobbyService.getGames();

        $scope.createGame = function(){
            var modelInstance = $modal.open({
                templateUrl: "views/modals/newGame.html",
                controller: "NewGameController"
            });
        };
        $scope.joinGame = function(gameId){
            var challenger = LobbyService.joinGame(gameId);

        };
        var newWatcherListener = $scope.$on("newWatcher", function(event, messageData){
            var watcherId = messageData.watcherId;

            $scope.games.forEach(function(game){
               if(game.gameId === messageData.gameId){
                   game.watchers.push(watcherId);
               }
            });
            $scope.$apply();
        });

        var watchTimeListener = $scope.$on("watchTime", function(event, messageData){
            $location.path("/watch/" + messageData.gameId);
            $scope.$apply();
        });


        $scope.watchGame = function(gameId){
            LobbyService.watchGame(gameId);
        };

        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.itemsPerPage = 6;
        $scope.setPage = function(pageNo){
            $scope.currentPage = pageNo;
        };
    };

    angular.module("app").controller("LobbyController", ["$scope", "$modal", "$location", "LobbyService", lobbyController])
})();