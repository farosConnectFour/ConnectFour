(function(){
    "use strict";
    var HomeController = function($scope, socketFactory){
        var socket;
        $scope.error = "Beste. Momenteel is er een probleem met de layout. Gelieve deze te negeren. Onze excuses voor dit ongemak.";
        $scope.info = undefined;

        socketFactory.getSocket(function(s){
            socket = s;
            socket.onmessage = function(data){
                var messageData = JSON.parse(data.data);
                if(messageData.messageType === "login"){
                    $scope.$broadcast("login", messageData);
                } else if (messageData.messageType === "message"){
                    $scope.$broadcast("message", messageData);
                } else if (messageData.messageType === "privateMessage"){
                    $scope.$broadcast("privateMessage", messageData);
                } else if (messageData.messageType === "initialLoad"){
                    $scope.$broadcast("initialLoad", messageData);
                } else if (messageData.messageType === "logout"){
                    $scope.$broadcast("logout", messageData);
                } else if (messageData.messageType === "gameCreated"){
                    $scope.$broadcast("gameCreated", messageData);
                } else if (messageData.messageType === "initGamesLoaded"){
                    $scope.$broadcast("initGamesLoaded", messageData);
                } else if (messageData.messageType === "error"){
                    $scope.error = messageData.error;
                    $scope.$apply();
                } else if (messageData.messageType === "gameClosed"){
                    $scope.$broadcast("gameClosed", messageData);
                } else if (messageData.messageType === "playTime"){
                    $scope.$broadcast("playTime", messageData);
                } else if (messageData.messageType === "updateRoom"){
                    $scope.$broadcast("updateRoom", messageData);
                } else if (messageData.messageType === "playerResigned"){
                    $scope.info = messageData.player.username + " resigned this game";
                    $scope.$broadcast("playerResigned", messageData);
                } else if (messageData.messageType === "watcherLeft"){
                    $scope.$broadcast("watcherLeft", messageData);
                } else if (messageData.messageType === "newWatcher"){
                    $scope.$broadcast("newWatcher", messageData);
                } else if (messageData.messageType === "watchTime"){
                    $scope.$broadcast("watchTime", messageData);
                }
            };
        });
        $scope.closeError = function(){
            $scope.error = undefined;
        };
        $scope.closeInfo = function(){
            $scope.info = undefined;
        };
    };

    angular.module("app").controller("HomeController", ["$scope","socketFactory", HomeController])
})();