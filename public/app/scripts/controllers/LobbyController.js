(function(){
    var lobbyController = function($scope, $modal, $location, LobbyService){
        $scope.games = LobbyService.getGames();
        angular.forEach($scope.games, function(game){
            angular.forEach($scope.players, function(player, index){
                if(game.host == player.userId){
                    game.host = $scope.players[index];
                }
            });
            game.watchers = [];
        });

        $scope.createGame = function(){
            var modelInstance = $modal.open({
                templateUrl: "views/modals/newGame.html",
                controller: "NewGameController"
            });
            modelInstance.result.then(function(data){
                $scope.games.push(data);
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