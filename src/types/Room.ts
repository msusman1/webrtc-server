export interface Room {
    name: string;
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
    eventType: ChatMessageEventType,
    personName: string,
    roomName: string,
    content: string,
    timestamp: string,
}

export enum ChatMessageEventType {
    leftRoom,textMessage,joinedRoom
}