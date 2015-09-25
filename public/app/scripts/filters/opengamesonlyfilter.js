(function(){
    "use strict";
    angular.module("app")
        .filter("opengamesonlyfilter", function() {
            return function(games, condition) {
                if (condition) {
                    var out = [];
                    if (games) {
                        angular.forEach(games, function (game) {
                            if (!game.challenger) {
                                out.push(game);
                            }
                        });
                        return out;
                    }
                }
                return games;
            }
        })
})();