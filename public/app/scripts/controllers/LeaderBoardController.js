(function(){
    "use strict"
    var leaderBoardController = function($scope){

        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.itemsPerPage = 5;
        $scope.setPage = function(pageNo){
            $scope.currentPage = pageNo;
        };
        $scope.$watch('players', function(newValue, oldValue){
            $scope.totalItems = newValue.length
        });
        //socket stuff
        var stompClient;

        $scope.connect = function(){
            var socket = new SockJS("http://10.1.15.60:8080/connectfour/gamePlayed");
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function(frame) {
                $scope.connected = true;
                stompClient.subscribe('/topic/gamePlayed', function(gamePlayed){
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
                $scope.$apply();
            });
        };
        $scope.connect();
        $scope.update = function(){
            stompClient.send('/app/gamePlayed', {}, JSON.stringify({ 'userId1': 1, 'userId2' : 2 }));
        }
    };


    angular.module("app").controller("LeaderBoardController", ["$scope",leaderBoardController])
})();