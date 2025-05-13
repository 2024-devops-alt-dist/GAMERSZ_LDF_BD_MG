// Socket.IO event types
export enum SocketEvents {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  JOIN_ROOM = "join_room",
  LEAVE_ROOM = "leave_room",
  NEW_MESSAGE = "new_message",
  USER_JOINED = "user_joined",
  USER_LEFT = "user_left",
  ERROR = "error"
}
