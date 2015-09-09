(function(){
    "use strict"
    var leaderBoardController = function($scope, LeaderBoardService){
        $scope.currentPage = 1;
        $scope.maxSize = 6;
        $scope.itemsPerPage = 5;
        $scope.setPage = function(pageNo){
            $scope.currentPage = pageNo;
        };
        LeaderBoardService.getAmountOfLeaders().then(function(response){
            $scope.totalItems = response;
        });

        var getLeaders = function(){
            LeaderBoardService.getPagedLeaders($scope.currentPage-1,$scope.itemsPerPage).then(function(response){
                $scope.leaders = response;
            });
        };
        getLeaders();

        $scope.pageChanged = function() {
            getLeaders();
        };
    }

    angular.module("app").controller("LeaderBoardController", ["$scope","LeaderBoardService",leaderBoardController])
})();