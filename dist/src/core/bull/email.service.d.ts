import { Job, Queue } from 'bull';
import { EmailService } from '../email/email.service';
export declare class EmailProcessor {
    private emailQueue;
    private emailService;
    constructor(emailQueue: Queue, emailService: EmailService);
    queueEmail(email: string, username: string): Promise<void>;
    handleSendWelcomeEmail(job: Job<{
        email: string;
        username: string;
    }>): Promise<void>;
}
