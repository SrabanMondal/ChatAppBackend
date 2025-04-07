import { User } from 'src/database/sql/entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { RegisterUserDto } from './user.dto';
import { LogService } from 'src/core/logger/logger.service';
import { AuthService } from 'src/core/auth/auth.service';
import { EmailService } from 'src/core/email/email.service';
import { EmailProcessor } from 'src/core/bull/email.service';
import { MongoService } from 'src/core/bull/mongo.service';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { UserData, UserDocument } from 'src/database/mongo/user.schema';
import { Model } from 'mongoose';
export declare class UserService {
    private userRepo;
    private logger;
    private authservice;
    private emailService;
    private datsource;
    private emailQueue;
    private mongodata;
    private cloudinaryService;
    private userModel;
    constructor(userRepo: Repository<User>, logger: LogService, authservice: AuthService, emailService: EmailService, datsource: DataSource, emailQueue: EmailProcessor, mongodata: MongoService, cloudinaryService: CloudinaryService, userModel: Model<UserDocument>);
    createUser(user: RegisterUserDto, role: string): Promise<User>;
    verifyOtp(otp: string): Promise<void>;
    signin(user: User, password: string): Promise<{
        userId: number;
        message: string;
        token: string;
    }>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(otp: string, password: string): Promise<void>;
    findbyId(userId: number): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, UserData> & UserData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, UserData> & UserData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    findAll(): Promise<User[]>;
    uploadProfilepic(userid: number, file: Express.Multer.File): Promise<string>;
    deleteProfilepic(userid: number): Promise<void>;
    updateName(userid: number, name: string): Promise<void>;
}
