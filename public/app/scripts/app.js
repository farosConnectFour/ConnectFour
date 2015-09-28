'use strict';
angular.module("app", ['ngRoute','ui.bootstrap','ngMessages','ngAnimate'])
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
    });

var checkLoggedin = function($q, $http, $location) {
    var deferred = $q.defer();
    $http.get('/loggedin').success(function(user) {
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