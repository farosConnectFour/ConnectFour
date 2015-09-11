(function(){
    var loginController = function($rootScope, $scope, $http, $location){

        var onLoginSucces = function(response){
            $rootScope.currentUser = response.data;
            $rootScope.connectToChatBox();
            $scope.loginMessage = '';
            $location.url('/lobby');
        };

        var onLoginError = function(error){
            $scope.loginMessage = 'Login failed. Please try again.';

        };

        $scope.loginMessage = '';
        $scope.login = function(user){
            $http.post("/login", user).then(onLoginSucces, onLoginError);
        };
    };

    angular.module("app").controller("LoginController", ["$rootScope", "$scope", "$http", "$location", loginController])
})();