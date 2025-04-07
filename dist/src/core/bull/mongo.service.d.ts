import { Job, Queue } from 'bull';
import { Model } from 'mongoose';
import { UserData, UserDocument } from 'src/database/mongo/user.schema';
import { User } from 'src/database/sql/entity/user.entity';
import { Repository } from 'typeorm';
export declare class MongoService {
    private userRepo;
    private addUserQueue;
    private usermodel;
    constructor(userRepo: Repository<User>, addUserQueue: Queue, usermodel: Model<UserDocument>);
    addMongoUser(email: string, name: string): Promise<void>;
    handleAddData(job: Job<{
        email: string;
        name: string;
    }>): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, UserData> & UserData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, UserData> & UserData & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
