import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/sql/entity/user.entity';
import { LessThan, Repository } from 'typeorm';
import { LogService } from '../logger/logger.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DatabaseCleaning {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private logger: LogService,
  ) {}
  @Cron('*/10 * * * *', { name: 'cleanExpiredOtps' })
  async handleClean() {
    try {
      await this.userRepo.update(
        { resetPasswordExpires: LessThan(new Date()) },
        { resetPasswordOtp: undefined, resetPasswordExpires: undefined },
      );
      this.logger.log('Cleaned Expired Reset Password Otps');
      await this.userRepo.update(
        { verificationExpires: LessThan(new Date()) },
        { verificationExpires: undefined },
      );
    } catch (error) {
      this.logger.error(`Error cleaning expired Otps: ${error}`);
    }
  }
  @Cron('0 0 * * *', { name: 'cleanUnverifiedUsers' })
  async handleUnverifiedUsers() {
    try {
      const onDayAgo = new Date(Date.now() - 60 * 60 * 24 * 1000);
      await this.userRepo.delete({
        isVerified: false,
        createdAt: LessThan(onDayAgo),
      });
      this.logger.log('Cleaned Unverified Users');
    } catch (error) {
      this.logger.error('Error deleting unverified users - ' + error);
    }
  }
}
