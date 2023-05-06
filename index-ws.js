const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function createWebsockerServer(req, res) {
    res.sendFile('index.html', {root: __dirname});
});

server.on('request', app);
server.listen(3000, function logListeningMessage() {
    console.log('Listening on 3000');
});


/** Begin websocket */
const WebSocketserver = require('ws').Server;

// Attach the web server we created with express
const wss = new WebSocketserver({
    server: server
});

// Listeners
wss.on('connection', function connection(ws) {
    const numClients = wss.clients.size;
    console.log('Clients connected', numClients);

    // Broadcast command, send message to everyone connected
    wss.broadcast(`Current visitors: ${numClients}`);

    // ws is going to have a state for every connection
    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to my server');
    }

    ws.on('close', function close() {
        wss.broadcast(`Current visitors: ${numClients}`);
        console.log('A client has disonnected');
    });
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};