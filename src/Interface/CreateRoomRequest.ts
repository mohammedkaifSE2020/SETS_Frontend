export interface CreateRoomRequest {
  hostUserId: string;
  maxPlayers: number;
  isPrivate: boolean;
}