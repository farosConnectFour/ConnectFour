(function(){
    var newGameController = function($scope, $modalInstance){

        //TODO: maak in de scope een nieuw object 'newGame' aan, met de nodige properties (zie html) en true als standaardwaarde voor een rated game

        $scope.create = function(){
            //TODO: createGame uit LobbyService aanroepen (injecteren in de controller!) met de juiste parameter, en sluit de modalInstance.
        };
        $scope.cancel = function(){
            //TODO: sluit de modalInstance
        }
    };

    angular.module("app").controller("NewGameController", ["$scope", "$modalInstance", newGameController])
})();