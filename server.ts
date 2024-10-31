import {Server, Socket} from "socket.io";

import {
    Answer,
    ChatMessage,
    IccCandidate,
    Offer,
    Peer,
    RoomJoinRequest,
    RoomLeaveRequest,
    RoomMessageRequest
} from "./Types";

const io = new Server({
    cors: {
        origin: "*", // Allow this origin
        methods: ["GET", "POST"],        // Allow these methods
        credentials: true,               // If you need to support cookies/auth
    },
});


io.on("connection", (socket: Socket) => {
    console.log(`connection connected socket id: ${socket.id}`);
    socket.on("send-icecandidate", (iceCandidate) => {
        console.log("Received ICE candidate:", iceCandidate);
        socket.broadcast.emit("receive-icecandidate", iceCandidate);
    });

    // Broadcast the offer to other clients
    socket.on("send-offer", (offer) => {
        console.log("Received offer:", offer);
        socket.broadcast.emit("receive-offer", offer);
    });

    // Broadcast the answer to other clients
    socket.on("send-answer", (answer) => {
        console.log("Received answer:", answer);
        socket.broadcast.emit("receive-answer", answer);
    });


    socket.on("join_room", async (joinRequest: RoomJoinRequest) => {
        console.log(`Joined Room socket id:${socket.id} , joinRequest `, joinRequest);
        socket.join(joinRequest.roomName)
        const roomMessage: Peer = {
            personName: joinRequest.personName,
            roomName: joinRequest.roomName,
            socketId: socket.id,
        }
        io.to(joinRequest.roomName).emit('user_joined', roomMessage);
    })

    socket.on("message", (roomMessageRequest: RoomMessageRequest) => {
        console.log(`message Socket Id: ${socket.id} roomMessageRequest:`, roomMessageRequest);
        const chatMessage: ChatMessage = {
            personName: roomMessageRequest.personName,
            content: roomMessageRequest.content,
            timestamp: new Date().toUTCString(),
        }
        io.to(roomMessageRequest.roomName).emit("message", chatMessage);
    })

    socket.on("leave_room", (roomLeaveRequest: RoomLeaveRequest) => {
        console.log(`Left Room socket id ${socket.id} , roomLeaveRequest`, roomLeaveRequest);
        socket.leave(roomLeaveRequest.roomName)
        const roomMessage: Peer = {
            personName: roomLeaveRequest.personName,
            roomName: roomLeaveRequest.roomName,
            socketId: socket.id,
        }
        socket.to(roomLeaveRequest.roomName).emit('user_left', roomMessage);
    })

    socket.on("offer", (offer: Offer) => {
        console.log(`Sdf offer: from:${offer.fromPeer} to:${offer.toPeer}`);
        socket.to(offer.toPeer).emit('offer', offer);
    })

    socket.on("answer", (answer: Answer) => {
        console.log(`Sdf answer from:${answer.fromPeer} to:${answer.toPeer}`);
        socket.to(answer.toPeer).emit("answer", answer)
    })
    socket.on("ice_candidate", (iccCandidate: IccCandidate) => {
        console.log(`ice_candidate: from:${iccCandidate.fromPeer} to:${iccCandidate.toPeer}`);
        socket.to(iccCandidate.toPeer).emit("ice-candidate", iccCandidate)
    })
    socket.on("disconnect", (data) => {
        console.log(`Disconnected socket id: ${socket.id}`);
    })
});
console.log("Signaling server listening on port 4000");

io.listen(4000);



