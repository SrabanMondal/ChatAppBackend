import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
//import { Room } from './room.schema';
export type UserDocument = HydratedDocument<UserData>;
@Schema({ versionKey: false })
export class UserData {
  @Prop({ required: true, unique: true, index: true })
  id: number;
  @Prop({ required: true })
  name: string;
  @Prop({ default: null })
  profilepic: string;
  @Prop({ default: null })
  pic_id: string;
  @Prop({ type: [Types.ObjectId], ref: 'Room', default: [] })
  room_id: Types.ObjectId[];
  @Prop({ type: [Types.ObjectId], ref: 'UserData', default: [] })
  friends: Types.ObjectId[];
}
export const UserDataSchema = SchemaFactory.createForClass(UserData);
