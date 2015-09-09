(function(){
    var newGameController = function($scope, $modalInstance, GameService){
        $scope.newGame = {
            name: null,
            rated: true
        }
        $scope.create = function(){
            var newGame = GameService.createGame($scope.newGame);
            $modalInstance.close(newGame);
        };
        $scope.cancel = function(){
            $modalInstance.dismiss("cancel");
        }
    }

    angular.module("app").controller("NewGameController", ["$scope", "$modalInstance", "GameService", newGameController])
})();