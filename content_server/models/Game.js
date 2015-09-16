function Game(gameId, name, host, challenger, rated, watchers){
    this.gameId = gameId;
    this.name = name;
    this.host = host;
    this.rated = rated;
    this.challenger = challenger;
    this.watchers = watchers;
}

module.exports = Game;