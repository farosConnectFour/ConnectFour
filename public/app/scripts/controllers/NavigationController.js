/**
 * Created by peeteli on 9/09/2015.
 */

(function(){
    var navController = function($scope, $http, $location, $rootScope){

        $scope.logout = function()
        {
            $http.post("/logout")
                .success(function()
                {
                    $rootScope.disconnectFromChatbox();
                    $rootScope.currentUser = undefined;
                    $location.url("/");
                });
        }

    };

    angular.module("app").controller("NavigationController", ["$scope", "$http", "$location", "$rootScope", navController])
})();