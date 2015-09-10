(function(){
    var indexController = function($scope, UserService){
        $scope.players = [];

        UserService.getAllPlayers().then(function(data){
            $scope.players = data;
            $scope.$broadcast("playersDownloaded");
        });
    };

    angular.module("app").controller("IndexController", ["$scope", "UserService", indexController])
})();