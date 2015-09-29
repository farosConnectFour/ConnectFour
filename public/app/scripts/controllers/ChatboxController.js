/**
 * Created by peeteli on 4/09/2015.
 */

(function(){

    "use strict";

    var chatboxController = function($rootScope, $scope, chatboxService){

        var currentUser,
            loginListener,
            initialLoadListener,
            logoutListener,
            messageListener,
            privateMessageListener;

        $scope.textInput = '';
        $scope.connectedUsers = [];
        $scope.messages = [];
        //TODO: uncomment deze lijn voor het gebruik van de tabs voor private chatting
        //$scope.tabs = [{username: 'General', messages: []}];

        $rootScope.connectToChatBox = function() {
            currentUser = $rootScope.currentUser;
            chatboxService.setUser(currentUser);

            // Listener for initial load-event: getting logged-in users
            initialLoadListener = $scope.$on("initialLoad", function(event, messageData){
                $scope.$apply($scope.connectedUsers = messageData.connectedUsers);
            });

            // Listener for login-events: logging a new connected user
            //TODO 01: Zorg ervoor dat deze berichten enkel in de general-tab terecht komen.
            //TODO 08: Als er al een bestaande tab is voor de ingelogde user, zet dan ook in de messages voor deze tab de login-melding
            loginListener = $scope.$on("login", function(event, messageData){
                if(currentUser.username !== messageData.user.username) {
                    $scope.$apply($scope.connectedUsers.push(messageData.user));
                    $scope.$apply($scope.messages.push({user: messageData.user.username, message: 'joined the room', logging: true}));
                    scrollTabDown();
                    //$scope.$apply(findGeneralTab().messages.push({user: messageData.user.username, message: 'joined the room', logging: true}));
                    //scrollTabDown(findGeneralTab());

                    //if(findTabByUsername(messageData.user.username)){
                    //    var privateMessageTab = findTabByUsername(messageData.user.username);
                    //    $scope.$apply(privateMessageTab.messages.push({user: messageData.user.username, message: 'joined the room', logging: true}));
                    //    scrollTabDown(privateMessageTab);
                    //}
                }
            });

            //TODO 02: idem TODO 01
            //TODO 09: idem TODO 08
            logoutListener = $scope.$on("logout", function(event, messageData){
                $scope.$apply($scope.connectedUsers.splice(getIndexConnectedUserByUsername(messageData.username), 1));
                $scope.$apply($scope.messages.push({user: messageData.username, message: 'left the room', logging: true}));
                scrollTabDown();
                //$scope.$apply(findGeneralTab().messages.push({user: messageData.username, message: 'left the room', logging: true}));
                //scrollTabDown(findGeneralTab());

                //if(findTabByUsername(messageData.username)){
                //    var privateMessageTab = findTabByUsername(messageData.username);
                //    $scope.$apply(privateMessageTab.messages.push({user: messageData.username, message: 'left the room', logging: true}));
                //    scrollTabDown(privateMessageTab);
                //}
            });

            //TODO 03: idem TODO 01
            messageListener = $scope.$on("message", function(event, messageData){
                $scope.$apply($scope.messages.push({sender: messageData.username, message: messageData.message, logging: false}));
                scrollTabDown();
                //$scope.$apply(findGeneralTab().messages.push({sender: messageData.username, message: messageData.message, logging: false}));
                //scrollTabDown(findGeneralTab());
            });

            //TODO 04: plaats de private message in de juiste tab (maak een nieuwe tab aan als er voor deze user nog geen tab is)
            privateMessageListener = $scope.$on("privateMessage", function(event, messageData){
                console.log(messageData);
                //var privateMessageTab = undefined;
                //if (messageData.sender === currentUser.username) {
                //    privateMessageTab = findTabByUsername(messageData.receiver);
                //} else {
                //    privateMessageTab = findTabByUsername(messageData.sender);
                //    if (!privateMessageTab) {
                //        var user = findUserByUsername(messageData.sender);
                //        user.messages = [];
                //        $scope.$apply($scope.tabs.push(user));
                //        privateMessageTab = findTabByUsername(messageData.sender);
                //    }
                //}
                //messageData.logging = false;
                //$scope.$apply(privateMessageTab.messages.push(messageData));
                //scrollTabDown(privateMessageTab);
            });
        };

        $rootScope.disconnectFromChatbox = function(){
            deregisterListeners();
            chatboxService.disconnect(function(){
                $scope.textInput = '';
                $scope.connectedUsers = [];
                $scope.messages = [];
                $scope.tabs = [{username: 'General', messages: []}];
            });
        };

        //TODO 05: ga na welke tab actief is bij het verzenden van een message. Indien een private message: voer volgende methode uit: chatboxService.sendMessage({messageType: 'privateMessage', sender: currentUser.username, receiver: activeTab.username, message: $scope.textInput});
        $scope.sendMessage = function(){
            if($scope.textInput){
                //var activeTab = $scope.active();
                //if(activeTab.username === 'General') {
                    chatboxService.sendMessage({messageType: 'message', user: currentUser.username, message: $scope.textInput});
                //} else {
                //    chatboxService.sendMessage({messageType: 'privateMessage', sender: currentUser.username, receiver: activeTab.username, message: $scope.textInput});
                //}
                $scope.textInput = '';
            }
        };

        $scope.isPrivateChatTab = function(username){
            return username !== 'General';
        };

        //TODO 06: ga na of er voor deze user al een tab bestaat, zo ja, maar deze actief, zo nee, maak een nieuwe tab aan en maak deze actief.
        $scope.openPrivateChat = function(user) {
            console.log('TODO: open a private chat tab for user: ' + user.username);
            //if(user.username !== currentUser.username) {
            //    var privateTab = findTabByUsername(user.username);
            //    if (!privateTab) {
            //        user.messages = [];
            //        $scope.tabs.push(user);
            //        privateTab = findTabByUsername(user.username);
            //        privateTab.active = true;
            //    } else {
            //        privateTab.active = true;
            //    }
            //}
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

        //TODO 07: zoek de juiste index voor de meegegeven tab en zorg dat voor deze tab naar beneden gescrolld wordt.
        function scrollTabDown(tab){
            //var tabIndex = $scope.tabs.indexOf(tab);
            //document.getElementsByClassName('messages')[tabIndex].scrollTop = document.getElementsByClassName('messages')[tabIndex].scrollHeight;
            document.getElementsByClassName('messages')[0].scrollTop = document.getElementsByClassName('messages')[0].scrollHeight;
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

        function deregisterListeners(){
            loginListener();
            initialLoadListener();
            logoutListener();
            messageListener();
            privateMessageListener();
        }

    };

    angular.module("app").controller("ChatboxController", ["$rootScope", "$scope", "chatboxService", chatboxController]);
})();
