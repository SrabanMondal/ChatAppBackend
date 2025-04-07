import {
  Controller,
  Get,
  Post,
  Body,
  //Param,
  //ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
  NotFoundException,
  Req,
  Param,
} from '@nestjs/common';
import { UserData } from 'src/database/mongo/user.schema';
//import { AddFriendDto } from './dto/add-friend.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';
import { User } from 'src/database/sql/entity/user.entity';
import { AddFriendDto } from './core/chat.types';

@Controller({
  version: '1',
  path: 'chat',
})
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('search/:name')
  async search(
    @Req() req: Request & { user: Omit<User, 'createdAt' | 'updatedAt'> },
    @Param('name') name: string,
  ) {
    const id = req.user.id;
    console.log(id, name);
    const users = await this.chatService.getUsers(name, id);
    return { users };
  }

  @Post('friends')
  @HttpCode(HttpStatus.CREATED)
  async addFriend(
    @Body() addFriendDto: AddFriendDto,
    @Req() req: Request & { user: Omit<User, 'createdAt' | 'updatedAt'> },
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    const { friendId } = addFriendDto;

    if (!friendId || isNaN(friendId)) {
      throw new BadRequestException('Invalid friend ID');
    }

    if (userId === friendId) {
      throw new BadRequestException('Cannot add yourself as a friend');
    }

    const friendExists = await this.chatService.getUser(friendId);
    if (!friendExists) {
      throw new NotFoundException('Friend not found');
    }

    const isAlreadyFriend = await this.chatService.isFriend(userId, friendId);
    if (isAlreadyFriend) {
      throw new BadRequestException('Friend already added');
    }

    await this.chatService.addFriend(userId, friendId);
    return { message: 'Friend added successfully' };
  }
  @Get('friends')
  @HttpCode(HttpStatus.OK)
  async getFriends(
    @Req() req: Request & { user: Omit<User, 'createdAt' | 'updatedAt'> },
  ): Promise<{ friends: UserData[] }> {
    const userId = req.user.id;
    const friends = await this.chatService.getFriends(userId);
    return { friends };
  }

  //   @Get('friends/:friendId')
  //   @HttpCode(HttpStatus.OK)
  //   async getChatDetails(
  //     @Param('friendId', ParseIntPipe) friendId: number,
  //     @Req() req,
  //   ): Promise<{
  //     roomId: string;
  //     recentMessages: MessageDocument[];
  //     friend: UserData;
  //   }> {
  //     const userId = req.user.id;

  //     if (userId === friendId) {
  //       throw new BadRequestException('Cannot chat with yourself');
  //     }

  //     const isFriend = await this.chatService.isFriend(userId, friendId);
  //     if (!isFriend) {
  //       throw new NotFoundException('Friend not found or not authorized');
  //     }

  //     const roomId = `room_${Math.min(userId, friendId)}_${Math.max(userId, friendId)}`;
  //     const recentMessages = await this.chatService.getPastMessages(roomId, 10); // Limit to 10 recent messages
  //     const friend = await this.chatService.getUser(friendId);

  //     return { roomId, recentMessages, friend };
  //   }

  //   @Post('friends/:friendId/read')
  //   @HttpCode(HttpStatus.OK)
  //   async markMessagesAsRead(
  //     @Param('friendId', ParseIntPipe) friendId: number,
  //     @Req() req,
  //   ): Promise<{ message: string }> {
  //     const userId = req.user.id;

  //     if (userId === friendId) {
  //       throw new BadRequestException('Cannot mark messages for yourself');
  //     }

  //     const isFriend = await this.chatService.isFriend(userId, friendId);
  //     if (!isFriend) {
  //       throw new NotFoundException('Friend not found or not authorized');
  //     }

  //     const roomId = `room_${Math.min(userId, friendId)}_${Math.max(userId, friendId)}`;
  //     await this.chatService.readMessages(roomId, userId);
  //     return { message: 'Messages marked as read' };
  //   }
}
