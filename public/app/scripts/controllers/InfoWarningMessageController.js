/**
 * Created by peeteli on 30/09/2015.
 */

(function(){
    "use strict";
    var infoWarningMessageController = function($scope){

        $scope.closeWarning = function(){
            $scope.warning = undefined;
        };

        $scope.closeInfo = function(){
            $scope.info = undefined;
        };

    };
    angular.module("app").controller("InfoWarningMessageController", ["$scope", infoWarningMessageController])
})();
