import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogService } from 'src/core/logger/logger.service';
import { Message, MessageDocument } from 'src/database/mongo/message.schema';
import { Room, RoomDocuement } from 'src/database/mongo/room.schema';
import { UserData, UserDocument } from 'src/database/mongo/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(UserData.name) private userModel: Model<UserDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocuement>,
    private logger: LogService,
  ) {}
  async getUser(userId: number) {
    try {
      const user = await this.userModel.findOne({ id: userId });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        "Couldn't find user" + String(error),
      );
    }
  }
  async getUsers(name: string, id: number) {
    try {
      const user = await this.userModel.findOne({ id: id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      //make below users are those, whose friends array don't have user._id
      const users = await this.userModel.find({
        _id: { $ne: user._id },
        name: { $regex: '^' + name, $options: 'i' },
        friends: { $nin: [user._id] },
      });
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        "Couldn't find users" + String(error),
      );
    }
  }
  async getFriends(userId: number) {
    try {
      const user = await this.userModel
        .findOne({ id: userId })
        .populate<{ friends: UserData[] }>('friends');
      if (!user) {
        throw new Error('User not found');
      }
      return user.friends;
    } catch (error) {
      throw new InternalServerErrorException(
        "Couldn't find friends" + String(error),
      );
    }
  }
  async getorCreateRoom(roomId: string, userId: number, receiverId: number) {
    // this.logger.debug("GetOrCreateRoom");
    const room = await this.roomModel
      .findOne({ roomId: roomId })
      .populate<{ participants: UserData[] }>('participants');
    const user = await this.userModel.findOne({ id: userId });
    const receiver = await this.userModel.findOne({ id: receiverId });
    if (!user || !receiver) {
      throw new InternalServerErrorException('Invalid users');
    }
    if (!room) {
      const newRoom = await this.roomModel.create({
        roomId: roomId,
        participants: [user?._id, receiver._id],
      });
      // console.log(newRoom);
      return newRoom;
    }
    return room;
  }
  async getPastMessages(roomId: string) {
    try {
      const pastMessages = await this.messageModel
        .find({ roomId: roomId })
        .sort({ createdAt: -1 })
        .limit(30)
        .populate({ path: 'senderId', select: 'name' });
      return pastMessages;
    } catch (error) {
      throw new InternalServerErrorException(
        "Couldn't find messages" + String(error),
      );
    }
  }
  async saveMessage(message: Message) {
    try {
      const msg = new this.messageModel(message);
      await msg.save({ validateBeforeSave: true });
      return msg;
    } catch (error) {
      this.logger.error('Save message error:', String(error));
      throw new InternalServerErrorException(
        `Couldn't save messages: ${String(error)}`,
      );
    }
  }
  async canJoinRoom(userId: number, receiverId: number): Promise<boolean> {
    const friend = await this.userModel.findOne({ id: receiverId });
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }
    const friends = await this.userModel.findOne({
      id: userId,
      friends: { $in: [friend._id] },
    });
    //.exec();
    return !!friends;
  }
  async readMessages(roomId: string, senderId: number) {
    const messages = await this.messageModel.updateMany(
      { roomId: roomId, senderId: senderId },
      { $set: { status: 'seen' } },
    );
    return messages;
  }
  async readMessage(message: MessageDocument) {
    const updatedMessage = await this.messageModel.findByIdAndUpdate(
      message._id,
      { $set: { status: 'seen' } },
      { new: true },
    );
    return updatedMessage;
  }
  async loadMessages(roomId: string, before: Date) {
    const room = await this.roomModel.findOne({ roomId: roomId });
    if (!room) {
      throw new InternalServerErrorException("Couldn't find room");
    }
    try {
      const messages = await this.messageModel
        .find({
          roomId: roomId,
          createdAt: { $lt: before },
        })
        .sort({ createdAt: -1 });
      return messages;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error loading messages' + String(error),
      );
    }
  }
  async isFriend(userID: number, friendID: number): Promise<boolean> {
    const user = await this.userModel.findOne({ id: userID });
    if (!user) {
      return false;
    }
    const friend = await this.userModel.findOne({ id: friendID });
    if (!friend) {
      return false;
    }
    return user.friends.includes(friend._id);
  }
  async addFriend(userId: number, friendId: number) {
    const user = await this.userModel.findOne({ id: userId });
    const friend = await this.userModel.findOne({ id: friendId });

    if (!user || !friend) {
      throw new NotFoundException('User not found');
    }
    user.friends.push(friend._id);
    friend.friends.push(user._id);
    await user.save();
    await friend.save();
  }
}
