import { Socket } from 'socket.io';
interface CustomHandshakeQuery {
    userId: string;
}
interface CustomSocketData {
    user?: {
        id: number;
        name?: string;
    };
    disconnectTimeout?: NodeJS.Timeout | null;
}
export type AuthenticatedSocket = Socket<any, any, any, CustomSocketData> & {
    handshake: {
        query?: CustomHandshakeQuery;
    };
};
export declare class AddFriendDto {
    friendId: number;
}
export {};
