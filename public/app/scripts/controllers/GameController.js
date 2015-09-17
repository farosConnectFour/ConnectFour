(function(){
    var gameController = function($scope, $location) {
        var board = []
        for (var row = 0; row < 6; row++) {
            var cols = [];
            for (var col = 0; col < 7; col++) {
                cols.push(0);
            }
            board.push(cols);
        }
        $scope.game = {
            board: board
        };

        var playerResignedListener = $scope.$on("playerResigned", function(event, messageData){
            $location.path('/lobby');
            $scope.$apply();
        });
    };

    angular.module("app").controller("GameController", ["$scope", "$location", gameController])
})();