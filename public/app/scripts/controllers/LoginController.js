(function(){
    var loginController = function($rootScope, $scope, $http, $location){

      $scope.login = function(user){
          console.log(user);
          $http.post("/login", user).success(function(response){
              $rootScope.currentUser = response;
              $rootScope.connectToChatBox();
              $location.url('/lobby');
          });
      };

    };

    angular.module("app").controller("LoginController", ["$rootScope", "$scope", "$http", "$location", loginController])
})();