(function(){
    "use strict";
    angular.module("app")
        .filter("playerfilter", function() {
            return function(games, searchPlayer, players) {
                var out = [];
                if(searchPlayer) {
                    angular.forEach(games, function (game) {
                        if (players[game.host - 1].name.toLowerCase().indexOf(searchPlayer.toLowerCase()) > -1) {
                            out.push(game);
                        } else if(game.challenger && players[game.challenger - 1].name.toLowerCase().indexOf(searchPlayer.toLowerCase()) > -1){
                            out.push(game);
                        }
                    });
                    return out;
                } else{
                    return games;
                }

            };
        })
})();