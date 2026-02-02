import type { PlayerInfo } from "./PlayerInfo";

export interface RoomResponse {
  roomId: string;
  roomCode: string;
  hostUserId: string;
  hostName: string;
  players: PlayerInfo[];
  status: string;
  currentPlayerCount: number;
  maxPlayers: number;
  isPrivate: boolean;
  lastAction?: {
    type: "PASS" | "DRAW" | "PLAY";
    senderId: string;
    senderName: string;
    receiverId?: string;
    receiverName?: string;
    cardValue?: string;
  };
}