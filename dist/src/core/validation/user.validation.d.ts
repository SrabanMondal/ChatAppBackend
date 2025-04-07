import { PipeTransform } from '@nestjs/common';
import { User } from 'src/database/sql/entity/user.entity';
import { LoginUserDto } from 'src/user/user.dto';
import { Repository } from 'typeorm';
export declare class ValidateUserPipe implements PipeTransform {
    private userRepository;
    constructor(userRepository: Repository<User>);
    transform(value: LoginUserDto): Promise<{
        user: User;
        password: string;
    }>;
}
