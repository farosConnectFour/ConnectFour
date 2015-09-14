/**
 * Created by peeteli on 4/09/2015.
 */

(function(){

    "use strict";

    var chatboxController = function($rootScope, $scope, chatboxService){

        var currentUser;

        $scope.textInput = '';
        $scope.connectedUsers = [];
        $scope.messages = [];
        $scope.tabs = [{username: 'General', messages: []}];

        $rootScope.connectToChatBox = function() {
            currentUser = $rootScope.currentUser;


            chatboxService.onReady(function () {
                chatboxService.setUser(currentUser);

                chatboxService.onMessage(function(messageData){
                    switch(messageData.messageType){
                        case 'login':
                            if(currentUser.username !== messageData.user.username) {
                                $scope.$apply($scope.connectedUsers.push(messageData.user));
                                $scope.messages = findGeneralTab().messages;
                                $scope.$apply($scope.messages.push({user: messageData.user.username, message: 'joined the room', logging: true}));
                                scrollTabDown(findGeneralTab());
                            }
                            break;
                        case 'initialLoad':
                            $scope.$apply($scope.connectedUsers = messageData.connectedUsers);
                            break;
                        case 'logout':
                            $scope.messages = findGeneralTab().messages;
                            $scope.$apply($scope.connectedUsers.splice(getIndexConnectedUserByUsername(messageData.username), 1));
                            $scope.$apply($scope.messages.push({user: messageData.username, message: 'left the room', logging: true}));
                            scrollTabDown(findGeneralTab());
                            break;
                        case 'message':
                            $scope.messages = findGeneralTab().messages;
                            $scope.$apply($scope.messages.push({sender: messageData.username, message: messageData.message, logging: false}));
                            scrollTabDown(findGeneralTab());
                            break;
                        case 'privateMessage':
                            var privateMessageTab = undefined;
                            if (messageData.sender === currentUser.username) {
                                privateMessageTab = findTabByUsername(messageData.receiver);
                            } else {
                                privateMessageTab = findTabByUsername(messageData.sender);
                                if (!privateMessageTab) {
                                    var user = findUserByUsername(messageData.sender);
                                    user.messages = [];
                                    $scope.$apply($scope.tabs.push(user));
                                    privateMessageTab = findTabByUsername(messageData.sender);
                                }
                            }
                            $scope.messages = privateMessageTab.messages;
                            messageData.logging = false;
                            $scope.$apply($scope.messages.push(messageData));
                            scrollTabDown(privateMessageTab);
                    }
                });

                console.log('Chatbox ready');
            });
            chatboxService.connect();
        };

        $rootScope.disconnectFromChatbox = function(){
            chatboxService.disconnect(function(){
                $scope.textInput = '';
                $scope.connectedUsers = [];
                $scope.messages = [];
                $scope.tabs = [{username: 'General', messages: []}];
            });
        };

        $scope.sendMessage = function(){
            if($scope.textInput){
                var activeTab = $scope.active();
                if(activeTab.username === 'General') {
                    chatboxService.sendMessage({messageType: 'message', user: currentUser.username, message: $scope.textInput});
                } else {
                    chatboxService.sendMessage({messageType: 'privateMessage', sender: currentUser.username, receiver: activeTab.username, message: $scope.textInput});
                }
                $scope.textInput = '';
            }
        };

        $scope.isPrivateChatTab = function(username){
            return username !== 'General';
        };

        $scope.openPrivateChat = function(user) {
            if(user.username !== currentUser.username) {
                var privateTab = findTabByUsername(user.username);
                if (!privateTab) {
                    console.log(user);
                    user.messages = [];
                    $scope.tabs.push(user);
                    privateTab = findTabByUsername(user.username);
                    privateTab.active = true;
                } else {
                    privateTab.active = true;
                }
            }
        };

        $scope.closePrivateChatTab = function(username){
            findTabByUsername(username).messages = [];
            $scope.tabs.splice(findTabIndexByUsername(username), 1);
        };

        $scope.active = function() {
            return $scope.tabs.filter(function(tab){
                return tab.active;
            })[0];
        };

        $scope.scrollDown = function(tab){
            scrollTabDown(tab);
        };

        function scrollTabDown(tab){
            var tabIndex = $scope.tabs.indexOf(tab);
            document.getElementsByClassName('messages')[tabIndex].scrollTop = document.getElementsByClassName('messages')[tabIndex].scrollHeight;
        }

        function findTabByUsername(username){
            var tabId = undefined;
            for(var i = 0; i < $scope.tabs.length; i++){
                if($scope.tabs[i] && $scope.tabs[i].username === username){
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

        function getIndexConnectedUserByUsername(username){
            for(var i = 0; i < $scope.connectedUsers.length; i++){
                if($scope.connectedUsers[i].username === username){
                    return i;
                }
            }
            return undefined;
        }

    };

    angular.module("app").controller("ChatboxController", ["$rootScope", "$scope", "chatboxService", chatboxController]);
})();
