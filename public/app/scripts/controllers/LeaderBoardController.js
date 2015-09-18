(function(){
    "use strict"
    var leaderBoardController = function($scope,PlayedGamesService){

        $scope.latestGames = [];
        PlayedGamesService.getLast5Games().then(function(response){
          $scope.latestGames = response;
        });
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.itemsPerPage = 5;
        $scope.setPage = function(pageNo){
            $scope.currentPage = pageNo;
        };
        //socket stuff
        var stompClient;

        $scope.connect = function(){
            var socket = new SockJS("http://10.1.15.60:8080/connectfour");
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function(frame) {
                $scope.connected = true;
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
                stompClient.subscribe('/topic/lastGame', function(lastGameResponse){
                    var lastGame = JSON.parse(lastGameResponse.body);
                        if($scope.latestGames.length >= 3) {
                            $scope.latestGames.pop();
                            $scope.latestGames.unshift(lastGame);
                        }
                    $scope.$apply();
                });
            });
        };
        $scope.connect();
        $scope.update = function(){
            stompClient.send('/', {}, JSON.stringify({'gameId': Math.floor((Math.random() * 10) + 1)}));
        }
    };


    angular.module("app").controller("LeaderBoardController", ["$scope","PlayedGamesService",leaderBoardController])
})();