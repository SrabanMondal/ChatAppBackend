import { Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailService } from '../email/email.service';

@Processor('email')
@Injectable()
export class EmailProcessor {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    private emailService: EmailService,
  ) {}
  async queueEmail(email: string, username: string) {
    await this.emailQueue.add(
      'send_welcome_email',
      { email, username },
      { attempts: 3, backoff: 5000 },
    );
  }
  @Process('send_welcome_email')
  async handleSendWelcomeEmail(job: Job<{ email: string; username: string }>) {
    try {
      await this.emailService.sendMail(
        job.data.email,
        'Welcome to ChatNest!',
        `Hi ${job.data.username},\n\nWelcome to ChatNest! We're excited to have you on board.`,
        `<h1>Welcome, ${job.data.username}!</h1><p>Thanks for joining ChatNest! We're excited to have you on board.</p>`,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to send verification email. Error: ' + error,
      );
    }
  }
}
