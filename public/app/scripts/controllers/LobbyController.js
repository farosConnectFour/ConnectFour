(function(){
    var lobbyController = function($scope, $modal, $location, LobbyService){
        $scope.games = [];
        $scope.$on("initGamesLoaded", function(event, messageData){
            $scope.games = messageData.games;
            console.log("Games : " + $scope.games.length);
            console.log("players : " + $scope.players.length);
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
        LobbyService.getGames();

        $scope.createGame = function(){
            var modelInstance = $modal.open({
                templateUrl: "views/modals/newGame.html",
                controller: "NewGameController"
            });
        };
        $scope.joinGame = function(gameId){
            var challenger = LobbyService.joinGame(gameId);
            angular.forEach($scope.games, function(game, index){
                if(game.gameId == gameId){
                    $scope.games[index].challenger = challenger;
                }
            });
            $location.path("/game");

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