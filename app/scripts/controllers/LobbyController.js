(function(){
    var lobbyController = function($scope, $modal, $location, GameService){
        $scope.games = [
            {
                gameId: 1,
                name: "Game #1",
                host: {
                    name: "Goldie",
                    points: 1650
                },
                challenger: null,
                rated: true,
                watchers: []
            },
            {
                gameId: 2,
                name: "Game #2",
                host: {
                    name: "Silvery",
                    points: 1500
                },
                challenger: null,
                rated: false,
                watchers: []
            },
            {
                gameId: 3,
                name: "Game #3",
                host: {
                    name: "Bronzy",
                    points: 1350
                },
                challenger: {
                    name: "Silvery",
                    points: 1500
                },
                rated: true,
                watchers: []
            }
        ];
        $scope.createGame = function(){
            var modelInstance = $modal.open({
                templateUrl: "views/modals/newGame.html",
                controller: "NewGameController"
            });
            modelInstance.result.then(function(data){
                $scope.games.push(data);
            })
        };
        $scope.joinGame = function(gameId){
            var challenger = GameService.joinGame(gameId);
            angular.forEach($scope.games, function(game, index){
                if(game.gameId == gameId){
                    $scope.games[index].challenger = challenger;
                }
            });
            $location.path("/game");

        };
        $scope.watchGame = function(gameId){
            var watcher = GameService.watchGame(gameId);
            angular.forEach($scope.games, function(game, index){
                if(game.gameId == gameId){
                    $scope.games[index].watchers.push(watcher);
                }
            });
            $location.path("/watch")
        };

    }

    angular.module("app").controller("LobbyController", ["$scope", "$modal", "$location", "GameService", lobbyController])
})();