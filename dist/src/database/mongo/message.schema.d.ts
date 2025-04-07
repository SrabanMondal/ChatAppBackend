import { HydratedDocument } from 'mongoose';
export type MessageDocument = HydratedDocument<Message>;
export declare class Message {
    roomId: string;
    senderId: number;
    senderName: string;
    content: string;
    type: string;
    status: 'sending' | 'sent' | 'delivered' | 'seen';
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, import("mongoose").Document<unknown, any, Message> & Message & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Message>> & import("mongoose").FlatRecord<Message> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
