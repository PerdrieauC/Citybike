export interface MessageEventData {
  roomId: string;
  senderId: string;
  receiverOrRoomId: string;
  isRoomMessage: boolean;
  content: string;
  date: Date;
}

export interface ConnectionEventData {
  senderId: string;
  receiverId: string;
}

export interface GroupConnectionEventData {
  roomId: string;
}

export interface RoomCreatedEventData {
  roomId: string;
}

export interface ServerToClientEvents {
  hello: () => void;
  roomJoined: (event: RoomCreatedEventData) => void;
  messageReceived: (event: MessageEventData) => void;
}

export interface ClientToServerEvents {
  connectToSomeone: (event: ConnectionEventData) => void;
  connectToGroup: (event: GroupConnectionEventData) => void;
  messageSended: (event: MessageEventData) => void;
}

export interface InterServerEvents {
  ping: () => void;
}
