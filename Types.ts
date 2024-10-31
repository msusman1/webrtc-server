export interface RoomJoinRequest {
    roomName: string,
    personName: string
}

export interface RoomMessageRequest {
    roomName: string,
    personName: string
    content: string
}

export interface Offer {
    offer: RTCSessionDescriptionInit,
    fromPeer: string,
    toPeer: string,
}

export interface Answer {
    answer: RTCSessionDescriptionInit,
    fromPeer: string,
    toPeer: string,
}


export interface RoomLeaveRequest {
    roomName: string,
    personName: string
}

export interface ChatMessage {
    personName: string,
    content: string,
    timestamp: string,
}

export interface Peer {
    roomName: string
    personName: string
    socketId: string
}

export interface IccCandidate {
    iccCandidate: RTCIceCandidate,
    fromPeer: string,
    toPeer: string,
}