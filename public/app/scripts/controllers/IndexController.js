(function(){
    var indexController = function($scope, UserService){
        $scope.players = [];

        UserService.getAllPlayers().then(function(data){
            $scope.players = data;
        });
    };

    angular.module("app").controller("IndexController", ["$scope", "UserService", indexController]);
})();