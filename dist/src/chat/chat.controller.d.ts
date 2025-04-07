import { UserData } from 'src/database/mongo/user.schema';
import { ChatService } from './chat.service';
import { User } from 'src/database/sql/entity/user.entity';
import { AddFriendDto } from './core/chat.types';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    search(req: Request & {
        user: Omit<User, 'createdAt' | 'updatedAt'>;
    }, name: string): Promise<{
        users: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, UserData> & UserData & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }> & import("mongoose").Document<unknown, {}, UserData> & UserData & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    addFriend(addFriendDto: AddFriendDto, req: Request & {
        user: Omit<User, 'createdAt' | 'updatedAt'>;
    }): Promise<{
        message: string;
    }>;
    getFriends(req: Request & {
        user: Omit<User, 'createdAt' | 'updatedAt'>;
    }): Promise<{
        friends: UserData[];
    }>;
}
