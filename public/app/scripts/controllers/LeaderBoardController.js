(function(){
    var leaderBoardController = function($scope){
        $scope.leaders = [
            {
                name: "Silvery",
                points: 1500
            },{
                name: "Bronzy",
                points: 1350
            },{
                name: "Goldie",
                points: 1625
            }
        ]
    }

    angular.module("app").controller("LeaderBoardController", ["$scope", leaderBoardController])
})();