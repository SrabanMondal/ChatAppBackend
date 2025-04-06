import { PipeTransform } from '@nestjs/common';
import { RegisterUserDto } from 'src/user/user.dto';
import * as bcrypt from 'bcrypt';
export class HashPassword implements PipeTransform {
  async transform(value: RegisterUserDto) {
    const salt = await bcrypt.genSalt(10);
    value.password = await bcrypt.hash(value.password, salt);
    return value;
  }
}
