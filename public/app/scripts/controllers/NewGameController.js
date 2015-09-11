(function(){
    var newGameController = function($scope, $modalInstance, LobbyService){
        $scope.newGame = {
            name: null,
            rated: true
        }
        $scope.create = function(){
            var newGame = LobbyService.createGame($scope.newGame);
            $modalInstance.close(newGame);
        };
        $scope.cancel = function(){
            $modalInstance.dismiss("cancel");
        }
    }

    angular.module("app").controller("NewGameController", ["$scope", "$modalInstance", "LobbyService", newGameController])
})();