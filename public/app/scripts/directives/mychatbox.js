(function(){
    "use strict";
    angular.module("app").directive("myChatbox",function(){
        return {
            restrict: 'E',
            templateUrl: "views/chat/chatbox.html",
            controller: "ChatboxController"
        }
    });
})();