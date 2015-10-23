(function(){
    "use strict";
    angular.module("app")
        .filter("playerfilter", function() {
            //TODO: maak een filter die enkel de games weergeeft waar de gezochte gebruiker host/challenger is (voeg de nodige parameters toe)
            return function(games) {
                return games;
            };
        })
})();