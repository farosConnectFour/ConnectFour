(function(){
    var gameController = function($scope) {
        var board = []
        for (var row = 0; row < 6; row++) {
            var cols = [];
            for (var col = 0; col < 7; col++) {
                cols.push(0);
            }
            board.push(cols);
        }
        $scope.game = {
            board:board
        }
    };

    angular.module("app").controller("GameController", ["$scope", gameController])
})();