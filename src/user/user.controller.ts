import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { HashPassword } from 'src/core/validation/hash-password';
import { UserService } from './user.service';
import { RegisterUserDto } from './user.dto';
import { ValidateUserPipe } from 'src/core/validation/user.validation';
import { User } from 'src/database/sql/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  check() {
    return { message: 'User controller is working' };
  }
  @UsePipes(new HashPassword())
  @Post('/register')
  async register(@Body() user: RegisterUserDto) {
    const createduser = await this.userService.createUser(user, 'user');
    return {
      id: createduser.id,
      username: createduser.username,
      email: createduser.email,
      role: createduser.role,
      createdAt: createduser.createdAt,
      updatedAt: createduser.updatedAt,
      message: 'OTP sent to your email ' + createduser.email,
    };
  }
  @Post('/verifyotp')
  async updatepassword(@Body('otp') otp: string) {
    await this.userService.verifyOtp(otp);
    return { message: 'OTP verified successfully' };
  }
  @UsePipes(ValidateUserPipe)
  @Post('/login')
  async login(@Body() logindata: { user: User; password: string }) {
    const { user, password } = logindata;
    const { userId, message, token } = await this.userService.signin(
      user,
      password,
    );
    return { userId, message, token };
  }

  @Post('/forgetPassword')
  async forgotPassword(@Body('email') email: string) {
    await this.userService.forgotPassword(email);
    return { message: 'Password reset OTP sent to your email' };
  }

  @Post('/resetPassword')
  async resetPassword(
    @Body() { otp, password }: { otp: string; password: string },
  ) {
    await this.userService.resetPassword(otp, password);
    return { message: 'Password reset successfully' };
  }

  @Post('/addprofilepic')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('profilePicture'))
  async addPhoto(
    @Req()
    req: Request & { user: Omit<User, 'createdAt' | 'updatedAt'> },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const pic = await this.userService.uploadProfilepic(req.user.id, file);
    return { message: pic };
  }

  @Delete('deleteprofilepic')
  @UseGuards(AuthGuard('jwt'))
  async deletePhoto(
    @Req() req: Request & { user: Omit<User, 'createdAt' | 'updatedAt'> },
  ) {
    await this.userService.deleteProfilepic(req.user.id);
    return { message: 'Profile picture deleted successfully' };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async findById(
    @Req()
    req: Request & { user: Omit<User, 'createdAt' | 'updatedAt'> },
  ) {
    const user = req.user;
    const mongoUser = await this.userService.findbyId(user.id);
    return { user, mongoUser };
  }

  @Put('name')
  @UseGuards(AuthGuard('jwt'))
  async updateName(
    @Req() req: Request & { user: Omit<User, 'createdAt' | 'updatedAt'> },
    @Body('name') name: string,
  ) {
    await this.userService.updateName(req.user.id, name);
    return { message: 'Name updated successfully' };
  }
}
