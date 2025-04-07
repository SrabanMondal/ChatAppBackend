import { HydratedDocument, Types } from 'mongoose';
export type UserDocument = HydratedDocument<UserData>;
export declare class UserData {
    id: number;
    name: string;
    profilepic: string;
    pic_id: string;
    room_id: Types.ObjectId[];
    friends: Types.ObjectId[];
}
export declare const UserDataSchema: import("mongoose").Schema<UserData, import("mongoose").Model<UserData, any, any, any, import("mongoose").Document<unknown, any, UserData> & UserData & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserData, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<UserData>> & import("mongoose").FlatRecord<UserData> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
