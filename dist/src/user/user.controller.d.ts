import { UserService } from './user.service';
import { RegisterUserDto } from './user.dto';
import { User } from 'src/database/sql/entity/user.entity';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    check(): {
        message: string;
    };
    register(user: RegisterUserDto): Promise<{
        message: string;
        status: boolean;
    }>;
    updatepassword(otp: string): Promise<{
        message: string;
    }>;
    login(logindata: {
        user: User;
        password: string;
    }): Promise<{
        userId: number;
        message: string;
        token: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword({ otp, password }: {
        otp: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
    addPhoto(req: Request & {
        user: Omit<User, 'createdAt' | 'updatedAt'>;
    }, file: Express.Multer.File): Promise<{
        message: string;
    }>;
    deletePhoto(req: Request & {
        user: Omit<User, 'createdAt' | 'updatedAt'>;
    }): Promise<{
        message: string;
    }>;
    findById(req: Request & {
        user: Omit<User, 'createdAt' | 'updatedAt'>;
    }): Promise<{
        user: Omit<User, "createdAt" | "updatedAt">;
        mongoUser: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../database/mongo/user.schema").UserData> & import("../database/mongo/user.schema").UserData & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }> & import("mongoose").Document<unknown, {}, import("../database/mongo/user.schema").UserData> & import("../database/mongo/user.schema").UserData & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>) | null;
    }>;
    updateName(req: Request & {
        user: Omit<User, 'createdAt' | 'updatedAt'>;
    }, name: string): Promise<{
        message: string;
    }>;
}
