(function(){
    var lobbyController = function($scope, $modal, $location, LobbyService){

        $scope.createGame = function(){
            //TODO: open een nieuwe modalInstance: templateURL: "views/modals/newGame.html", controller: "NewGameController"
        };

        $scope.joinGame = function(gameId){
            LobbyService.joinGame(gameId);

        };

        $scope.watchGame = function(gameId){
            LobbyService.watchGame(gameId);
        };

        LobbyService.getGames();

        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.itemsPerPage = 6;
        $scope.setPage = function(pageNo){
            $scope.currentPage = pageNo;
        };
    };

    angular.module("app").controller("LobbyController", ["$scope", "$modal", "$location", "LobbyService", lobbyController])
})();