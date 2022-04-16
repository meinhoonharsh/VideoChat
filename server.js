// Creating a Server for Video Chat Application
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: 'GET,POST',
    }
});


const users = {};
const socketToSpace = {};


io.on('connection', (socket) => {
    socket.emit("me", socket.id)

    // socket.on("disconnect", () => {
    //     socket.broadcast.emit("callEnded")
    // })

    // socket.on("callUser", (data) => {
    //     io.to(data.to).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    // })

    // socket.on("answerCall", (data) => {
    //     io.to(data.to).emit("callAccepted", data.signalData)
    // })


    // socket.on("callsomeone", (data) => {
    //     socket.emit("someonecalling", data)
    // })


    // join all users to the same room
    socket.on("joinSpace", (data) => {
        socket.join(data.spaceId)
        socket.to(data.spaceId).emit("userJoined", data)

        if (users[data.spaceId]) {

            if (users[data.spaceId].includes(data.id)) {
                return
            }
            else if (users[data.spaceId].length == 4) {
                socket.emit("spacefull")
                return
            }
            users[data.spaceId].push(data.id)
        } else {
            console.log("Data.id", data.id)
            users[data.spaceId] = [data.id]
        }

        socketToSpace[data.id] = data.spaceId


        console.log("users", users)
        console.log("socketToSpace", socketToSpace)

    })


    socket.on("sendSignal", (data) => {
        console.log("sendSignal", data)
        io.to(data.to).emit("usercalling", data)
    })

    socket.on("signalAccepted", (data) => {
        console.log("signalAccepted", data)
        io.to(data.to).emit("signalAccepted", data)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected")
        socket.to(socketToSpace[socket.id]).emit("userLeft", { id: socket.id })
        socket.leave(socketToSpace[socket.id])

        if (socketToSpace[socket.id]) {

            // Remove user from users array
            let userIndex = users[socketToSpace[socket.id]].indexOf(socket.id)
            users[socketToSpace[socket.id]].splice(userIndex, 1)

            // Remove socket from socketToSpace
            delete socketToSpace[socket.id]
        }
        console.log("users:", users)
        console.log("socketToSpace:", socketToSpace)
    })




});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});