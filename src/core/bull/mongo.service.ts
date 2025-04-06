import { InjectQueue, Process, Processor } from '@nestjs/bull';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Queue } from 'bull';
import { Model } from 'mongoose';
import { UserData, UserDocument } from 'src/database/mongo/user.schema';
import { User } from 'src/database/sql/entity/user.entity';
import { Repository } from 'typeorm';

@Processor('mongo')
@Injectable()
export class MongoService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectQueue('mongo') private addUserQueue: Queue,
    @InjectModel(UserData.name) private usermodel: Model<UserDocument>,
  ) {}
  async addMongoUser(email: string, name: string) {
    await this.addUserQueue.add(
      'add_user',
      { email, name },
      {
        attempts: 2,
        backoff: 2000,
      },
    );
  }
  @Process('add_user')
  async handleAddData(job: Job<{ email: string; name: string }>) {
    const user = await this.userRepo.findOneBy({ email: job.data.email });
    if (!user) {
      throw new NotFoundException('User not found in database');
    }
    const id = user.id;
    const { name } = job.data;
    const existUser = await this.usermodel.findOne({ id: id }).exec();
    if (existUser) {
      throw new ConflictException('User already exists in mongodb');
    }
    const newUser = new this.usermodel({ id, name });
    return newUser.save();
  }
}
