(function(){
    var lobbyController = function($scope, $modal, $location, LobbyService){
        $scope.games = [];
        $scope.$on("initGamesLoaded", function(event, messageData){
            $scope.games = messageData.games;
            angular.forEach($scope.games, function(game){
                angular.forEach($scope.players, function(scopePlayer, index){
                    if(game.host == scopePlayer.userId){
                        game.host = $scope.players[index];
                    }
                    if(game.challenger == scopePlayer.userId){
                        game.challenger = $scope.players[index];
                    }
                });
            });
            $scope.$apply();
        });
        var createGameListener = $scope.$on("gameCreated", function(event, messageData){
            var game = messageData.game;
            angular.forEach($scope.players, function(scopePlayer, index){
                if(game.host == scopePlayer.userId){
                    game.host = $scope.players[index];
                }
            });
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
                    angular.forEach($scope.players, function(player){
                        if($scope.games[index].host == player.userId){
                            $scope.games[index].host = player;
                        }
                        if($scope.games[index].challenger == player.userId){
                            $scope.games[index].challenger = player;
                        }
                    });
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
        $scope.watchGame = function(gameId){
            var watcher = LobbyService.watchGame(gameId);
            angular.forEach($scope.games, function(game, index){
                if(game.gameId == gameId){
                    $scope.games[index].watchers.push(watcher);
                }
            });
            $location.path("/watch")
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