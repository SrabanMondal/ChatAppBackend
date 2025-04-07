import { User } from 'src/database/sql/entity/user.entity';
import { Repository } from 'typeorm';
import { LogService } from '../logger/logger.service';
export declare class DatabaseCleaning {
    private userRepo;
    private logger;
    constructor(userRepo: Repository<User>, logger: LogService);
    handleClean(): Promise<void>;
    handleUnverifiedUsers(): Promise<void>;
}
