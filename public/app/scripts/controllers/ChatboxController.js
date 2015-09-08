/**
 * Created by peeteli on 4/09/2015.
 */

(function(){

    "use strict";

    var chatboxController = function($scope){

        var socket = io('http://10.1.15.94:9998'),
            username,
            getIndexConnectedUserByUsername = function(username){
                for(var i = 0; i < $scope.connectedUsers.length; i++){
                    if($scope.connectedUsers[i].username === username){
                        return i;
                    }
                }
                return undefined;
            };

        $scope.textInput = '';
        $scope.connectedUsers = [];
        $scope.messages = [];
        $scope.tabs = [{username: 'General', messages: []}];
        $scope.isPrivateChatTab = function(username){
            return username !== 'General';
        };
        $scope.closePrivateChatTab = function(username){
            findTabByUsername(username).messages = [];;
            $scope.tabs.splice(findTabIndexByUsername(username), 1);
        };
        $scope.sendMessage = function(){
            if($scope.textInput){
                var activeTab = $scope.active();
                if(activeTab.username === 'General'){
                    socket.emit("sendMessage", $scope.textInput);
                } else {
                    socket.emit("sendPrivateMessage", {receiver: {id: activeTab.id, username: activeTab.username}, message: $scope.textInput})
                }

                $scope.textInput = '';
            }
        };
        $scope.openPrivateChat = function(user) {
            if(user.username !== username) {
                var privateTab = findTabByUsername(user.username);
                if (!privateTab) {
                    $scope.tabs.push(user);
                    privateTab = findTabByUsername(user.username);
                    privateTab.active = true;
                } else {
                    privateTab.active = true;
                }
            }
        };
        $scope.active = function() {
            return $scope.tabs.filter(function(tab){
                return tab.active;
            })[0];
        };

        socket.on('connect', function(){
            username = prompt("What is your username?");
            socket.emit('join', username);
        });

        socket.on('disconnect', function(){
            socket.emit('disconnect');
        });

        socket.on('initialLoad', function(data){
            $scope.$apply($scope.connectedUsers = data.users);
        });

        socket.on('addChatter', function(user){
            $scope.messages = findGeneralTab().messages;
            $scope.$apply($scope.connectedUsers.push(user));
            $scope.$apply($scope.messages.push({user: user.username, message: 'joined the room', logging: true}));
            scrollTabDown(findGeneralTab());
        });

        socket.on('removeChatter', function(username){
            $scope.messages = findGeneralTab().messages;
            $scope.$apply($scope.connectedUsers.splice(getIndexConnectedUserByUsername(username), 1));
            $scope.$apply($scope.messages.push({user: username, message: 'left the room', logging: true}));
            scrollTabDown(findGeneralTab());
        });

        socket.on('newMessage', function(data){
            $scope.messages = findGeneralTab().messages;
            data.logging = false;
            $scope.$apply($scope.messages.push(data));
            scrollTabDown(findGeneralTab());
        });

        socket.on('newPrivateMessage', function(data){
            var privateMessageTab = undefined;
            if(data.sender === username){
                privateMessageTab = findTabByUsername(data.receiver);
            } else {
                privateMessageTab = findTabByUsername(data.sender);
                if(!privateMessageTab){
                    $scope.$apply($scope.tabs.push(findUserByUsername(data.sender)));
                    privateMessageTab = findTabByUsername(data.sender);
                }
            }
            $scope.messages = privateMessageTab.messages;
            data.logging = false;
            $scope.$apply($scope.messages.push(data));
            scrollTabDown(privateMessageTab);
        });

        function scrollTabDown(tab){
            var tabIndex = $scope.tabs.indexOf(tab);
            document.getElementsByClassName('messages')[tabIndex].scrollTop = document.getElementsByClassName('messages')[tabIndex].scrollHeight;
        }

        function findTabByUsername(username){
            var tabId = undefined;
            for(var i = 0; i < $scope.tabs.length; i++){
                if($scope.tabs[i].username === username){
                    tabId = i;
                    break;
                }
            }
            if(tabId != undefined){
                return $scope.tabs[tabId];
            } else {
                return undefined;
            }
        }

        function findTabIndexByUsername(username){
            for(var i = 0; i < $scope.tabs.length; i++){
                if($scope.tabs[i].username === username){
                    return i;
                }
            }
            return undefined;
        }

        function findGeneralTab(){
            return findTabByUsername('General');
        }

        function findUserByUsername(user){
            for(var i = 0; i < $scope.connectedUsers.length; i++){
                if($scope.connectedUsers[i].username === user){
                    return $scope.connectedUsers[i];
                }
            }
            return undefined;
        }

    };

    angular.module("app").controller("ChatboxController", ["$scope", chatboxController]);
})();