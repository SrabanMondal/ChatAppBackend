"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const bull_2 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const email_service_1 = require("../email/email.service");
let EmailProcessor = class EmailProcessor {
    emailQueue;
    emailService;
    constructor(emailQueue, emailService) {
        this.emailQueue = emailQueue;
        this.emailService = emailService;
    }
    async queueEmail(email, username) {
        console.log('Queue welcome mail');
        await this.emailQueue.add('send_welcome_email', { email, username }, { attempts: 3, backoff: 5000 });
    }
    async handleSendWelcomeEmail(job) {
        try {
            console.log('Sending welcome mail');
            await this.emailService.sendMail(job.data.email, 'Welcome to ChatNest!', `Hi ${job.data.username},\n\nWelcome to ChatNest! We're excited to have you on board.`, `<h1>Welcome, ${job.data.username}!</h1><p>Thanks for joining ChatNest! We're excited to have you on board.</p>`);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to send verification email. Error: ' + error);
        }
    }
};
exports.EmailProcessor = EmailProcessor;
__decorate([
    (0, bull_1.Process)('send_welcome_email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "handleSendWelcomeEmail", null);
exports.EmailProcessor = EmailProcessor = __decorate([
    (0, bull_1.Processor)('email'),
    (0, common_1.Injectable)(),
    __param(0, (0, bull_2.InjectQueue)('email')),
    __metadata("design:paramtypes", [Object, email_service_1.EmailService])
], EmailProcessor);
//# sourceMappingURL=email.service.js.map