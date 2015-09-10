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
               controller: "LobbyController"
           })
           .when("/game", {
               templateUrl: "views/game.html",
               controller: "GameController"
           })
           .when("/watch", {
               templateUrl: "views/watch.html",
               controller: "WatchController"
           });
    })
    .filter('offset', function() {
        return function(input, start) {
            start = parseInt(start, 10);
            return input.slice(start);
        };
    });