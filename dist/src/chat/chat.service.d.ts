import { Model } from 'mongoose';
import { LogService } from 'src/core/logger/logger.service';
import { Message, MessageDocument } from 'src/database/mongo/message.schema';
import { Room, RoomDocuement } from 'src/database/mongo/room.schema';
import { UserData, UserDocument } from 'src/database/mongo/user.schema';
export declare class ChatService {
    private userModel;
    private messageModel;
    private roomModel;
    private logger;
    constructor(userModel: Model<UserDocument>, messageModel: Model<MessageDocument>, roomModel: Model<RoomDocuement>, logger: LogService);
    getUser(userId: number): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, UserData> & UserData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, UserData> & UserData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    getUsers(name: string, id: number): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, UserData> & UserData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, UserData> & UserData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getFriends(userId: number): Promise<UserData[]>;
    getorCreateRoom(roomId: string, userId: number, receiverId: number): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Room> & Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, Room> & Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getPastMessages(roomId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Message> & Message & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, Message> & Message & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    saveMessage(message: Message): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Message> & Message & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, Message> & Message & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    canJoinRoom(userId: number, receiverId: number): Promise<boolean>;
    readMessages(roomId: string, senderId: number): Promise<import("mongoose").UpdateWriteOpResult>;
    readMessage(message: MessageDocument): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Message> & Message & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, Message> & Message & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    loadMessages(roomId: string, before: Date): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Message> & Message & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, Message> & Message & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    isFriend(userID: number, friendID: number): Promise<boolean>;
    addFriend(userId: number, friendId: number): Promise<void>;
}
