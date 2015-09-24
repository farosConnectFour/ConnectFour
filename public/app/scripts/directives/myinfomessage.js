(function(){
    "use strict";
    angular.module("app").directive("myInfoMessage",function(){
        return {
            restrict: 'E',
            scope:{
                info: "="
            },
            templateUrl: "views/messages/infomessage.html",
            controller: function($scope){
                $scope.closeInfo = function(){
                    $scope.info = undefined;
                };
            }
        }
    });
})();