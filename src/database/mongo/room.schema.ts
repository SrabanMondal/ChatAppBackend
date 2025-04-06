import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoomDocuement = HydratedDocument<Room>;
@Schema({ versionKey: false })
export class Room {
  @Prop({ required: true, unique: true, index: true })
  roomId: string;
  @Prop({ type: Types.ObjectId, ref: 'UserData' })
  participants: Types.ObjectId[];
}
export const RoomSchema = SchemaFactory.createForClass(Room);
