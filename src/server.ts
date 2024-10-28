import {Server, Socket} from "socket.io";
import {
    AnswerRequest,
    ChatMessage, IccCandidateRequest,
    OfferRequest,
    RoomJoinRequest,
    RoomLeaveRequest,
    RoomMessage,
    RoomMessageRequest
} from "./types/Room";

const io = new Server({
    cors: {
        origin: "*", // Allow this origin
        methods: ["GET", "POST"],        // Allow these methods
        credentials: true,               // If you need to support cookies/auth
    },
});


io.on("connection", (socket: Socket) => {
    console.log(`connection connected socket id: ${socket.id}`);

    socket.on("join_room", async (joinRequest: RoomJoinRequest) => {
        console.log(`Joined Room socket id:${socket.id} , joinRequest `, joinRequest);
        socket.join(joinRequest.roomName)
        const roomMessage: RoomMessage = {
            personName: joinRequest.personName,
            roomName: joinRequest.roomName,
            socketId: socket.id,
            timestamp: new Date().toUTCString(),
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
        const roomMessage: RoomMessage = {
            personName: roomLeaveRequest.personName,
            roomName: roomLeaveRequest.roomName,
            socketId: socket.id,
            timestamp: new Date().toUTCString(),
        }
        socket.to(roomLeaveRequest.roomName).emit('user_left', roomMessage);


    })

    socket.on("offer", (offerRequest: OfferRequest) => {
        console.log(`Sdf offer:`, offerRequest);
        socket.to(offerRequest.roomName).emit('offer', offerRequest);

    })

    socket.on("answer", (answerRequest: AnswerRequest) => {
        console.log(`Sdf answer`, answerRequest);
        socket.to(answerRequest.answerFor).emit("answer", answerRequest)
    })
    socket.on("ice-candidate", (iccCandidateRequest: IccCandidateRequest) => {
        console.log(`getIceCandidate:`, iccCandidateRequest);
        const iccCandidateRequestNew: IccCandidateRequest = {
            iccCandidate: iccCandidateRequest.iccCandidate,
            fromSocketId: iccCandidateRequest.fromSocketId,
        }
        socket.to(iccCandidateRequest.fromSocketId).emit("ice-candidate", iccCandidateRequestNew)
    })
    socket.on("disconnect", (data) => {
        console.log(`Disconnected socket id: ${socket.id}`);
    })
});
console.log("Signaling server listening on port 4000");
io.listen(4000);
