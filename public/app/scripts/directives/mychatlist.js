(function(){
    "use strict";
    angular.module("app").directive("myChatList", function(){
       return{
           restrict: "E",
           templateUrl: "views/chat/chatlist.html"
       }
    });
})();