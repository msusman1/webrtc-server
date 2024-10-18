const {Server} = require("socket.io");

const io = new Server({
    cors: {
        origin: "*", // Allow this origin
        methods: ["GET", "POST"],        // Allow these methods
        credentials: true,               // If you need to support cookies/auth
    },
});
io.on("connection", (socket) => {
    console.log(`connection connected socket id: ${socket.id}`);
    socket.on("join_room", ({personName, roomName}) => {
        console.log(`Joined Room socket id:${socket.id} , personName:${personName} roomName:${roomName}`);
        socket.join(roomName)
        socket.to(roomName).emit('receive_channel', {
            eventType: "joinedRoom",
            personName: personName,
            roomName: roomName,
            content: "User joined",
            timestamp: new Date().toUTCString(),
        });
    })
    socket.on("send_channel", ({roomName, personName, content}) => {
        console.log(`Send Channel Socket Id: ${socket.id} to roomName:${roomName},personName${personName}, content:${content}`);
        io.to(roomName).emit("receive_channel", {
            eventType: "textMessage",
            roomName: roomName,
            personName: personName,
            content: content,
            timestamp: new Date().toUTCString(),
        });
    })
    socket.on("leave_room", ({personName, roomName}) => {
        socket.leave(roomName)
        console.log(`Left Room socket id ${socket.id} , personName:${personName} roomName:${roomName}`);
        socket.to(roomName).emit('receive_channel', {
            eventType: "leftRoom",
            personName: personName,
            roomName: roomName,
            content: "User left",
            timestamp: new Date().toUTCString(),
        });
    })
    socket.on("disconnect", (data) => {
        console.log(`Disconnected socket id: ${socket.id}`);
    })
});
console.log("Signaling server listening on port 3000");
io.listen(3000);
