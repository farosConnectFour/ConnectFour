//public

var self = module.exports = {

    sendToSingleClient : function (message, client) {
        client.write(JSON.stringify(message));
    },

    broadcast : function (message, clients) {
        for (var client in clients) {
            // send the message to that client
            this.sendToSingleClient(message, clients[client]);
        }
    }
};


