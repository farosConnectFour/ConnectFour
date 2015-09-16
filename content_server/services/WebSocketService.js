function WebSocketService(){

}

WebSocketService.prototype.sendToSingleClient = function(message, client){
    client.write(JSON.stringify(message));
};

WebSocketService.prototype.broadcast = function(message, clients){
    for (var client in clients){
        // send the message to that client
        this.sendToSingleClient(message, clients[client]);
    }
};

module.exports = WebSocketService;


