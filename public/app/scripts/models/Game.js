function Game(gameId, name, host, rated){
    this.gameId = gameId;
    this.name = name;
    this.host = host;
    this.rated = rated;
    this.challenger = null;
    this.watchers = [];
}