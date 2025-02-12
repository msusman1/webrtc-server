# WebRTC Server Demo 

This is a signaling protocol implementation for a WebRTC client app. It allows users to join rooms, exchange video/audio streams, and send real-time chat messages through WebRTC and Socket.IO.

You can check the webrtc client demo implemented using Reactjs: [WebRTC Client Repo](https://github.com/msusman1/webrtc-client).

## Features

- Create and join rooms for WebRTC video/audio sessions
- Real-time messaging within rooms
- Handling WebRTC signaling for peer connection setup and media streaming

## Tech Stack

- **Node.js**
- **Socket.IO**
- **TypeScript**

## Prerequisites

1. Clone this repository and install dependencies:

   ```bash
   git clone https://github.com/your-username/webrtc-server.git
   cd webrtc-server
   npm install
   ```

2. Start the server:

   ```bash
   npm run start
   ```

3. Configure the client application to use this server as its signaling server (e.g., `SERVER_URL` in your client).

## WebRTC Flow with Socket.IO

The signaling server facilitates the WebRTC peer-to-peer (P2P) connection setup by managing events for joining, messaging, leaving, and signaling (offers, answers, and ICE candidates). Here’s an overview of the events and flows in this server:

### 1. Connection

Each time a user connects to the server, a unique socket ID is assigned:

```javascript
io.on("connection", (socket: Socket) => {
    console.log(`Connection established: socket ID ${socket.id}`);
    ...
});
```

### 2. Joining a Room

A user can join a room with the `join_room` event, providing their name and the room name. The server then:
- Joins the user to the specified room.
- Broadcasts a `user_joined` event to all users in the room to announce the new user.

```javascript
socket.on("join_room", (joinRequest: RoomJoinRequest) => {
    socket.join(joinRequest.roomName);
    const roomMessage = {
        personName: joinRequest.personName,
        roomName: joinRequest.roomName,
        socketId: socket.id,
    };
    io.to(joinRequest.roomName).emit("user_joined", roomMessage);
});
```

### 3. Real-time Messaging

Users in a room can send messages using the `message` event, containing the sender's name, message content, and timestamp. The server broadcasts the message to all users in the room.

```javascript
socket.on("message", (roomMessageRequest: RoomMessageRequest) => {
    const chatMessage = {
        personName: roomMessageRequest.personName,
        content: roomMessageRequest.content,
        timestamp: new Date().toUTCString(),
    };
    io.to(roomMessageRequest.roomName).emit("message", chatMessage);
});
```

### 4. Leaving a Room

When a user leaves, the `leave_room` event is triggered:
- Removes the user from the room.
- Notifies other users in the room via `user_left`.

```javascript
socket.on("leave_room", (roomLeaveRequest: RoomLeaveRequest) => {
    socket.leave(roomLeaveRequest.roomName);
    const roomMessage = {
        personName: roomLeaveRequest.personName,
        roomName: roomLeaveRequest.roomName,
        socketId: socket.id,
    };
    socket.to(roomLeaveRequest.roomName).emit("user_left", roomMessage);
});
```

### 5. WebRTC Signaling Process

The signaling events for setting up WebRTC peer connections are handled as follows:

#### Offer

When a user initiates a connection, an `offer` is sent to the target peer:

```javascript
socket.on("offer", (offer: Offer) => {
    socket.to(offer.toPeer).emit("offer", offer);
});
```

#### Answer

In response to an offer, the target peer sends an `answer` back to establish the connection:

```javascript
socket.on("answer", (answer: Answer) => {
    socket.to(answer.toPeer).emit("answer", answer);
});
```

#### ICE Candidates

To establish the best possible connection path, both peers exchange ICE candidates:

```javascript
socket.on("ice_candidate", (iccCandidate: IccCandidate) => {
    socket.to(iccCandidate.toPeer).emit("ice-candidate", iccCandidate);
});
```

### 6. Disconnect

When a user disconnects, the `disconnect` event is logged for cleanup or reconnection handling.

```javascript
socket.on("disconnect", () => {
    console.log(`Disconnected socket ID: ${socket.id}`);
});
```

## Flow for Joining, Messaging, and Leaving

1. **Join Room**:
    - The client emits `join_room`.
    - The server adds the client to the room and broadcasts `user_joined`.

2. **Messaging**:
    - The client emits `message`.
    - The server broadcasts the message to the room.

3. **Leaving Room**:
    - The client emits `leave_room`.
    - The server removes the client and broadcasts `user_left`.

4. **WebRTC Signaling**:
    - The server facilitates the P2P WebRTC connection by relaying offers, answers, and ICE candidates.

## Current Issues

- Remote video streams may not display in the client UI, despite being received through the `RTCPeerConnection.ontrack` event. Further troubleshooting is ongoing.

## How to Contribute

1. **Fork the repository**
2. **Create a branch**: `git checkout -b my-new-feature`
3. **Commit your changes**: `git commit -am 'Add some feature'`
4. **Push to the branch**: `git push origin my-new-feature`
5. **Create a new Pull Request**

## License

MIT License © 2023 msusman1

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


 
