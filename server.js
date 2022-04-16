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
/*
users = [
    "spaceId": [
        socketIds
    ]
]
*/

const socketToSpace = {};
/*
socketToSpace = {
    "socketId": "spaceId"
}
*/

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




    // Called whenever someone joins the space
    socket.on("joinSpace", (data) => {

        // Joining users socket to space
        socket.join(data.spaceId)

        // Emitting to the space that a user has joined
        socket.to(data.spaceId).emit("userJoined", data)


        // Adding user to users object
        if (users[data.spaceId]) {

            // If user already exists in users object
            if (users[data.spaceId].includes(data.id)) {
                return
            }
            // If room is already full
            else if (users[data.spaceId].length == 4) {
                socket.emit("spacefull")
                return
            }
            users[data.spaceId].push(data.id)
        }
        else {
            console.log("Data.id", data.id)
            users[data.spaceId] = [data.id]
        }

        // Adding user to socketToSpace object
        socketToSpace[data.id] = data.spaceId


        console.log("users", users)
        console.log("socketToSpace", socketToSpace)

    })



    // Called when someone calls another user to create a Peer connection
    socket.on("sendSignal", (data) => {
        console.log("sendSignal", data)
        io.to(data.to).emit("usercalling", data)
    })

    // Called when someone accepts the call for a Peer connection
    socket.on("signalAccepted", (data) => {
        console.log("signalAccepted", data)
        io.to(data.to).emit("signalAccepted", data)
    })


    // Called whenever someone leaves the space
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