import { Socket } from 'socket.io';
interface CustomHandshakeQuery {
  userId: string;
}

interface CustomSocketData {
  user?: { id: number; name?: string };
  disconnectTimeout?: NodeJS.Timeout | null;
}

// Now create the custom socket type
export type AuthenticatedSocket = Socket<
  any, // ClientToServerEvents
  any, // ServerToClientEvents
  any, // InterServerEvents
  CustomSocketData
> & {
  handshake: {
    query?: CustomHandshakeQuery;
  };
};
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddFriendDto {
  @IsInt()
  @IsNotEmpty()
  friendId: number;
}
