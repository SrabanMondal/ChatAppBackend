import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
//import { Room } from './room.schema';
export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  roomId: string;
  @Prop({ required: true })
  senderId: number;

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: true })
  content: string;

  @Prop({ enum: ['text', 'image', 'video'], default: 'text' })
  type: string;

  @Prop({ default: 'sent' })
  status: 'sending' | 'sent' | 'delivered' | 'seen';
}

export const MessageSchema = SchemaFactory.createForClass(Message);
