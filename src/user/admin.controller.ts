import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { HashPassword } from 'src/core/validation/hash-password';
import { UserService } from './user.service';
import { RegisterUserDto } from './user.dto';
import { ValidateUserPipe } from 'src/core/validation/user.validation';
import { User } from 'src/database/sql/entity/user.entity';
import { Role, Roles } from 'src/core/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/core/guards/role-guard';

@Controller({
  version: '1',
  path: 'admin',
})
export class AdminController {
  constructor(private userService: UserService) {}

  @UsePipes(new HashPassword())
  @Post('/register')
  async register(@Body() user: RegisterUserDto) {
    const createduser = await this.userService.createUser(user, 'admin');
    return {
      id: createduser.id,
      username: createduser.username,
      email: createduser.email,
      role: createduser.role,
      createdAt: createduser.createdAt,
      updatedAt: createduser.updatedAt,
    };
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

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.Admin)
  @Get('getusers')
  async findAllUsers() {
    const users = await this.userService.findAll();
    return users;
  }
}
