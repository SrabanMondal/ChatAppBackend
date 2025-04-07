import { LogService } from 'src/core/logger/logger.service';
import { EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { User } from '../entity/user.entity';
export declare class AdminSubscriber implements EntitySubscriberInterface<User> {
    private logger;
    constructor(logger: LogService);
    listenTo(): typeof User;
    afterInsert(event: InsertEvent<User>): void;
    afterUpdate(event: UpdateEvent<User>): void;
}
