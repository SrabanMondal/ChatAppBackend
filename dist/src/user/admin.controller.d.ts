import { UserService } from './user.service';
import { RegisterUserDto } from './user.dto';
import { User } from 'src/database/sql/entity/user.entity';
export declare class AdminController {
    private userService;
    constructor(userService: UserService);
    register(user: RegisterUserDto): Promise<{
        id: number;
        username: string;
        email: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(logindata: {
        user: User;
        password: string;
    }): Promise<{
        userId: number;
        message: string;
        token: string;
    }>;
    findAllUsers(): Promise<User[]>;
}
