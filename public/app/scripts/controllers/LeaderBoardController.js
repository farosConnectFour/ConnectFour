(function(){
    "use strict";
    var leaderBoardController = function($scope){
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.itemsPerPage = 5;
        $scope.setPage = function(pageNo){
            $scope.currentPage = pageNo;
        };

        $scope.connect = function(){
            var socket = new SockJS("http://10.1.15.60:8080/connectfour");
            var stompClient = Stomp.over(socket);
            stompClient.connect({}, function() {
                stompClient.subscribe('/topic/playerChanges', function(gamePlayed){
                    var changedPlayers = JSON.parse(gamePlayed.body);
                    angular.forEach(changedPlayers, function(changedPlayer){
                        angular.forEach($scope.players, function(scopePlayer, index){
                            if(changedPlayer.userId == scopePlayer.userId){
                                $scope.players[index].points = changedPlayer.points;
                            }
                        });
                    });
                    $scope.$apply();
                });
            });
        }();
    };
    angular.module("app").controller("LeaderBoardController", ["$scope",leaderBoardController])
})();