import {Server, Socket} from "socket.io";
import {
    ChatMessage,
    ChatMessageEventType,
    Room,
    RoomJoinRequest,
    RoomLeaveRequest,
    RoomMessageRequest
} from "./types/Room";

const io = new Server({
    cors: {
        origin: "*", // Allow this origin
        methods: ["GET", "POST"],        // Allow these methods
        credentials: true,               // If you need to support cookies/auth
    },
});


const rooms: Room[] = []
io.on("connection", (socket: Socket) => {
    console.log(`connection connected socket id: ${socket.id}`);
    socket.on("create_room", (roomName: string) => {
        const existingRoom = rooms.find((room: Room) => room.name === roomName);
        if (existingRoom) {
            console.log("room with same name already exists");
            socket.emit("room_created", existingRoom)
        } else {
            const newRoom: Room = {name: roomName}
            rooms.push(newRoom);
            socket.emit("room_created", newRoom)
        }


    })
    socket.on("join_room", (joinRequest: RoomJoinRequest) => {
        console.log(`Joined Room socket id:${socket.id} , joinRequest `, joinRequest);
        if (rooms.map(it => it.name).includes(joinRequest.roomName)) {
            socket.join(joinRequest.roomName)
            const chatMessage: ChatMessage = {
                eventType: ChatMessageEventType.joinedRoom,
                personName: joinRequest.personName,
                roomName: joinRequest.roomName,
                content: "User joined",
                timestamp: new Date().toUTCString(),
            }
            socket.to(joinRequest.roomName).emit('receive_channel', chatMessage);
        } else {
            console.log(`room ${joinRequest.roomName} not exists`)
        }
    })

    socket.on("send_channel", (roomMessageRequest: RoomMessageRequest) => {
        console.log(`Send Channel Socket Id: ${socket.id} roomMessageRequest:`, roomMessageRequest);
        if (rooms.map(it => it.name).includes(roomMessageRequest.roomName)) {
            const chatMessage: ChatMessage = {
                eventType: ChatMessageEventType.textMessage,
                roomName: roomMessageRequest.roomName,
                personName: roomMessageRequest.personName,
                content: roomMessageRequest.content,
                timestamp: new Date().toUTCString(),
            }
            io.to(roomMessageRequest.roomName).emit("receive_channel", chatMessage);
        } else {
            console.log(`room ${roomMessageRequest.roomName} not exists`)
        }
    })

    socket.on("leave_room", (roomLeaveRequest: RoomLeaveRequest) => {
        console.log(`Left Room socket id ${socket.id} , roomLeaveRequest`, roomLeaveRequest);
        socket.leave(roomLeaveRequest.roomName)
        const chatMessage: ChatMessage = {
            eventType: ChatMessageEventType.leftRoom,
            personName: roomLeaveRequest.personName,
            roomName: roomLeaveRequest.roomName,
            content: "User left",
            timestamp: new Date().toUTCString(),
        }
        socket.to(roomLeaveRequest.roomName).emit('receive_channel', chatMessage);
    })

    socket.on("offer", (sdf) => {
        console.log(`Sdf offer:`, sdf);
        socket.broadcast.emit("getOffer", sdf)
    })
    socket.on("answer", (sdf) => {
        console.log(`Sdf answer`, sdf);
        socket.broadcast.emit("getAnswer", sdf)
    })
    socket.on("iceCandidate", (iceCandidate) => {
        console.log(`getIceCandidate:`, iceCandidate);
        socket.broadcast.emit("getIceCandidate", iceCandidate)
    })
    socket.on("disconnect", (data) => {
        console.log(`Disconnected socket id: ${socket.id}`);
    })
});
console.log("Signaling server listening on port 4000");
io.listen(4000);
