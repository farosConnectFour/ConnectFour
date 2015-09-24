(function(){
    "use strict";
    var LatestGamesController = function($scope, PlayedGamesService){
        $scope.latestGames = [];
        PlayedGamesService.getLast5Games().then(function(response){
            $scope.latestGames = response;
        });
        $scope.connect = function(){
            var socket = new SockJS("http://10.1.15.60:8080/connectfour");
            var stompClient = Stomp.over(socket);
            stompClient.connect({}, function() {
                $scope.connected = true;
                stompClient.subscribe('/topic/lastGame', function(lastGameResponse){
                    var lastGame = JSON.parse(lastGameResponse.body);
                    if($scope.latestGames.length >= 3) {
                        $scope.latestGames.pop();
                        $scope.latestGames.unshift(lastGame);
                    } else{
                        $scope.latestGames.unshift(lastGame);
                    }
                    $scope.$apply();
                });
            });
        }();
    };
    angular.module("app").controller("LatestGamesController", ["$scope","PlayedGamesService",LatestGamesController])
})();