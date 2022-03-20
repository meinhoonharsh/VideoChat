// Creating a Server for Video Chat Application
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors: {
        origin: '*',
        methods: 'GET,POST',
    }
});

io.on('connection', (socket) => {
    console.log('New user connected');
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});