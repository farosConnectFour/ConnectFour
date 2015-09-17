'use strict';
angular.module("app", ['ngRoute','ui.bootstrap'])
    .config(function($routeProvider){
       $routeProvider
           .when("/", {
               templateUrl: "views/login.html",
               controller: "LoginController"
           })
           .when("/lobby", {
               templateUrl: "views/lobby.html",
               controller: "LobbyController",
               resolve: {
                   loggedin: checkLoggedin
               }

           })
           .when("/game/:gameId", {
               templateUrl: "views/game.html",
               controller: "GameController",
               resolve: {
                   loggedin: checkLoggedin
               }
           })
           .when("/watch/:gameId", {
               templateUrl: "views/watch.html",
               controller: "WatchController",
               resolve: {
                   loggedin: checkLoggedin
               }
           })
           .otherwise({redirectTo:"/"});
    })
    .filter('offset', function() {
        return function(input, start) {
            if (input) {
                start = parseInt(start, 10);
                return input.slice(start);
            } else{
                return [];
            }
        };
    });

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();

    $http.get('/loggedin').success(function(user) {
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user !== '0') {
            deferred.resolve();
        }
        // User is Not Authenticated
        else {
            deferred.reject();
            $location.url('/');
        }
    });

    return deferred.promise;
};