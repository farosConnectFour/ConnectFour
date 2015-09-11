/**
 * Created by peeteli on 11/09/2015.
 */

(function(){
    "use strict";
    var connectedUsersService = function(){

        //private
        var connectedUsers = [];

        var getConnectedUsers = function(){
            return connectedUsers;
        };


        //public
        return {
            getConnectedUsers: getConnectedUsers
        }

    };
    angular.module("app").service("connectedUserService", [connectedUsersService()]);
})();
