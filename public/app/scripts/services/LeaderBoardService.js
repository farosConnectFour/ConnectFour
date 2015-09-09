(function(){
    "use strict";
    var LeaderBoardService = function($http){
        var getPagedLeaders = function(requestedPage, size){
            var req = {
                method: "GET",
                url: "http://localhost:8080/connectfour/api/leaderboard",
                params: {
                    requestedPage: requestedPage,
                    size: size
                }
            };
            return $http(req).then(function(response){
                return response.data;
            });
        };
        var getAmountOfLeaders = function(){
            var req = {
                method: "GET",
                url: "http://localhost:8080/connectfour/api/leaderboard/amount"
            };
            return $http(req).then(function(response){
                return response.data;
            });
        }
        return {
            getPagedLeaders: getPagedLeaders,
            getAmountOfLeaders: getAmountOfLeaders
        }
    }
    angular.module("app").service("LeaderBoardService", ["$http", LeaderBoardService]);
})();