(function(){
    "use strict";
    var watchController = function($scope, $location, $interval){
        $scope.$on("involvedGameClosed", function(event, messageData){
            $interval(function(){
                $location.path("/lobby");
            },5000);
        });
    };
    angular.module("app").controller("WatchController", ["$scope","$location","$interval", watchController])
})();