import {Server, Socket} from "socket.io";

const io = new Server({
    cors: {
        origin: "*", // Allow this origin
        methods: ["GET", "POST"],        // Allow these methods
        credentials: true,               // If you need to support cookies/auth
    },
});


io.on("connection", (socket: Socket) => {
    console.log(`connection connected socket id: ${socket.id}`);

    socket.on("chat_offer", (message: any) => {
        message.fromPeerSocketId = socket.id
        const toPeerSocketId = message.toPeerSocketId
        console.log(`Received chat_offer:`, message);
        socket.to(toPeerSocketId).emit("chat_offer", message);
    });

    socket.on("chat_answer", (message: any) => {
        message.fromPeerSocketId = socket.id
        const toPeerSocketId = message.toPeerSocketId
        console.log("Received chat_answer:", message);
        socket.to(toPeerSocketId).emit("chat_answer", message);
    });

    socket.on("chat_ice_candidate", (message: any) => {
        message.fromPeerSocketId = socket.id
        const toPeerSocketId = message.toPeerSocketId
        console.log("Received chat_ice_candidate:", message);
        socket.to(toPeerSocketId).emit("chat_ice_candidate", message);
    });

    socket.on("disconnect", (data) => {
        console.log(`Disconnected socket id: ${socket.id}`);
    })
});
console.log("Signaling server listening on port 4000");

io.listen(4000);



