import { HydratedDocument, Types } from 'mongoose';
export type RoomDocuement = HydratedDocument<Room>;
export declare class Room {
    roomId: string;
    participants: Types.ObjectId[];
}
export declare const RoomSchema: import("mongoose").Schema<Room, import("mongoose").Model<Room, any, any, any, import("mongoose").Document<unknown, any, Room> & Room & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Room, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Room>> & import("mongoose").FlatRecord<Room> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
