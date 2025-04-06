import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/sql/entity/user.entity';
import { LoginUserDto } from 'src/user/user.dto';
import { Repository } from 'typeorm';
@Injectable()
export class ValidateUserPipe implements PipeTransform {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async transform(
    value: LoginUserDto,
  ): Promise<{ user: User; password: string }> {
    const { email, password } = value;
    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { user, password };
  }
}
