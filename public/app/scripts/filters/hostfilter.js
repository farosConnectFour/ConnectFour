(function(){
    "use strict";
    angular.module("app")
        .filter("hostfilter", function() {
            return function(input, searchHost, players) {
                var out = [];
                if(searchHost) {
                    angular.forEach(input, function (game) {
                        if (players[game.host - 1].name.toLowerCase().indexOf(searchHost.toLowerCase()) > -1) {
                            out.push(game);
                        }
                    });
                    return out;
                } else{
                    return input;
                }

            };
        })
})();