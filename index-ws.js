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

// Signal interrupt with a process listener - be aware that it won't work if the websocket is not closed
process.on('SIGINT', () => {
    console.log('sigit');
    wss.clients.forEach(function each(client) {
       client.close();
    });
    server.close(() => {
        shutdownDB();
    });
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

    db.run(`INSERT INTO visitors (count, time) VALUES (${numClients}, datetime('now'))`)

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

/** end websockets */

/** begin database */

const sqlite = require('sqlite3');
// const db = new sqlite.Database('./sirinyarichardson.db');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
    db.run(`
        CREATE TABLE visitors
        (
            count INTEGER,
            time  TEXT
        )
    `)
});


function getCounts() {
    db.each("SELECT * FROM visitors", (err, row) => {
        console.log(row);
    });
}

function shutdownDB() {
    getCounts();
    console.log("Shutting down db")
    db.close();
}