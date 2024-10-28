
export interface OfferRequest {
    offer: RTCSessionDescriptionInit,
    roomName: string,
    offerFrom: string
}

export interface AnswerRequest {
    answer: RTCSessionDescriptionInit,
    roomName: string,
    answerFor: string
}

export interface RoomJoinRequest {
    roomName: string,
    personName: string
}

export interface RoomMessageRequest {
    roomName: string,
    personName: string
    content: string
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

export interface RoomMessage {
    timestamp: string,
    roomName: string
    personName: string
    socketId: string
}



export interface IccCandidateRequest {
    iccCandidate: RTCIceCandidate,
    fromSocketId: string,
}