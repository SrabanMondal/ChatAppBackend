"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const logger_service_1 = require("../core/logger/logger.service");
const message_schema_1 = require("../database/mongo/message.schema");
const room_schema_1 = require("../database/mongo/room.schema");
const user_schema_1 = require("../database/mongo/user.schema");
const typeorm_1 = require("typeorm");
let ChatService = class ChatService {
    userModel;
    messageModel;
    roomModel;
    logger;
    constructor(userModel, messageModel, roomModel, logger) {
        this.userModel = userModel;
        this.messageModel = messageModel;
        this.roomModel = roomModel;
        this.logger = logger;
    }
    async getUser(userId) {
        try {
            const user = await this.userModel.findOne({ id: userId });
            return user;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Couldn't find user" + String(error));
        }
    }
    async getUsers(name, id) {
        try {
            const user = await this.userModel.findOne({ id: id });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const users = await this.userModel.find({
                _id: { $ne: user._id },
                name: { $regex: '^' + name, $options: 'i' },
                friends: { $nin: [user._id] },
            });
            return users;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Couldn't find users" + String(error));
        }
    }
    async getFriends(userId) {
        try {
            const user = await this.userModel
                .findOne({ id: userId })
                .populate('friends');
            if (!user) {
                throw new Error('User not found');
            }
            return user.friends;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Couldn't find friends" + String(error));
        }
    }
    async getorCreateRoom(roomId, userId, receiverId) {
        this.logger.debug(`GetOrCreateRoom for roomId: ${roomId}`);
        const user = await this.userModel.findOne({ id: userId }).lean();
        const receiver = await this.userModel.findOne({ id: receiverId }).lean();
        if (!user || !receiver) {
            throw new common_1.InternalServerErrorException('Invalid users');
        }
        const room = await this.roomModel
            .findOneAndUpdate({ roomId }, {
            roomId,
            participants: { $addToSet: { $each: [user._id, receiver._id] } },
            updatedAt: new Date(),
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            populate: { path: 'participants', model: 'UserData' },
        })
            .catch((error) => {
            this.logger.error(`Failed to find or create room ${roomId}:`, String(error));
            if (error instanceof typeorm_1.MongoServerError && error?.code === 11000) {
                return this.roomModel.findOne({ roomId }).populate('participants');
            }
            throw new common_1.InternalServerErrorException('Room operation failed');
        });
        if (!room) {
            throw new common_1.InternalServerErrorException('Room not found after operation');
        }
        return room;
    }
    async getPastMessages(roomId) {
        try {
            const pastMessages = await this.messageModel
                .find({ roomId: roomId })
                .sort({ createdAt: -1 })
                .limit(30)
                .populate({ path: 'senderId', select: 'name' });
            return pastMessages;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Couldn't find messages" + String(error));
        }
    }
    async saveMessage(message) {
        try {
            const msg = new this.messageModel(message);
            await msg.save({ validateBeforeSave: true });
            return msg;
        }
        catch (error) {
            this.logger.error('Save message error:', String(error));
            throw new common_1.InternalServerErrorException(`Couldn't save messages: ${String(error)}`);
        }
    }
    async canJoinRoom(userId, receiverId) {
        const friend = await this.userModel.findOne({ id: receiverId });
        if (!friend) {
            throw new common_1.NotFoundException('Friend not found');
        }
        const friends = await this.userModel.findOne({
            id: userId,
            friends: { $in: [friend._id] },
        });
        return !!friends;
    }
    async readMessages(roomId, senderId) {
        const messages = await this.messageModel.updateMany({ roomId: roomId, senderId: senderId }, { $set: { status: 'seen' } });
        return messages;
    }
    async readMessage(message) {
        const updatedMessage = await this.messageModel.findByIdAndUpdate(message._id, { $set: { status: 'seen' } }, { new: true });
        return updatedMessage;
    }
    async loadMessages(roomId, before) {
        const room = await this.roomModel.findOne({ roomId: roomId });
        if (!room) {
            throw new common_1.InternalServerErrorException("Couldn't find room");
        }
        try {
            const messages = await this.messageModel
                .find({
                roomId: roomId,
                createdAt: { $lt: before },
            })
                .sort({ createdAt: -1 });
            return messages;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error loading messages' + String(error));
        }
    }
    async isFriend(userID, friendID) {
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
    async addFriend(userId, friendId) {
        const user = await this.userModel.findOne({ id: userId });
        const friend = await this.userModel.findOne({ id: friendId });
        if (!user || !friend) {
            throw new common_1.NotFoundException('User not found');
        }
        user.friends.push(friend._id);
        friend.friends.push(user._id);
        await user.save();
        await friend.save();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.UserData.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __param(2, (0, mongoose_1.InjectModel)(room_schema_1.Room.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        logger_service_1.LogService])
], ChatService);
//# sourceMappingURL=chat.service.js.map