(function(){
    var newGameController = function($scope, $modalInstance, LobbyService){
        $scope.newGame = {
            name: null,
            rated: true
        };
        $scope.create = function(){
            LobbyService.createGame($scope.newGame, function(data){
                console.log(data);
                $modalInstance.close(data);
            });
        };
        $scope.cancel = function(){
            $modalInstance.dismiss("cancel");
        }
    };

    angular.module("app").controller("NewGameController", ["$scope", "$modalInstance", "LobbyService", newGameController])
})();