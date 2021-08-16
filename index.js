const express = require('express');
const socket = require('socket.io');
// App setup
let app = express();
let server = app.listen(4201, ()=> {
    console.log('listening to requests on port 4201');
});

// Static files
app.use(express.static('public'));

// Socket setup
let io = socket(server);

io.on('connection', (socket) => {
    socket.on('userInfo', (userInfo) => {
        console.log(`socket connection made successful:  ${socket.id}, ${new Date(socket.handshake.issued)}, ${userInfo.userName}, ${userInfo.sessionId}`);
        io.sockets.emit('userInfo', userInfo.userName);
        socket.broadcast.emit('userJoined', userInfo.userName);
        socket.userName = userInfo.userName;
        // io.sockets.emit('connectionWithClient', userInfo.userName);
    });

    socket.on('disconnect', (data) => {
        console.log(`User ${socket.userName} is disconneted`);
        console.log(data);
        io.sockets.emit('disconnected', socket.userName);
    });
});
