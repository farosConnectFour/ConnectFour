(function(){
    "use strict";
    angular.module("app").directive("myChatter", function(){
        return{
            restrict: "E",
            templateUrl: "views/chat/chatter.html",
            replace: true
        }
    });
})();