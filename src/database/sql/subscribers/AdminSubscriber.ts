import { LogService } from 'src/core/logger/logger.service';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from '../entity/user.entity';
@EventSubscriber()
export class AdminSubscriber implements EntitySubscriberInterface<User> {
  constructor(private logger: LogService) {}
  listenTo() {
    return User;
  }
  afterInsert(event: InsertEvent<User>) {
    const { entity } = event;
    if (entity.role == 'admin') {
      this.logger.log(
        `Admin user created: ID=${entity.id}, Email=${entity.email}, Username=${entity.username}, CreatedAt=${entity.createdAt.toLocaleString()}`,
      );
    }
  }
  afterUpdate(event: UpdateEvent<User>) {
    const { entity } = event;
    if (
      entity &&
      entity instanceof User &&
      entity.role.toLowerCase() === 'admin'
    ) {
      this.logger.log(
        `Admin user updated: ID=${entity.id}, Email=${entity.email}, Username=${entity.username}, UpdatedAt=${entity.updatedAt.toLocaleString()}`,
      );
    }
  }
}
