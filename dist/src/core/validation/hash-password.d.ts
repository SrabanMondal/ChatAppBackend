import { PipeTransform } from '@nestjs/common';
import { RegisterUserDto } from 'src/user/user.dto';
export declare class HashPassword implements PipeTransform {
    transform(value: RegisterUserDto): Promise<RegisterUserDto>;
}
