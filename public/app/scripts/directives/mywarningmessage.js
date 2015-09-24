(function(){
    "use strict";
    angular.module("app").directive("myWarningMessage",function(){
        return {
            restrict: 'E',
            scope:{
                warning: "="
            },
            templateUrl: "views/messages/warningmessage.html",
            controller: function($scope){
                $scope.closeWarning = function(){
                    $scope.warning = undefined;
                };
            }
        }
    });
})();