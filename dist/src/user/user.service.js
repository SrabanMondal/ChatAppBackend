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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../database/sql/entity/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const logger_service_1 = require("../core/logger/logger.service");
const auth_service_1 = require("../core/auth/auth.service");
const email_service_1 = require("../core/email/email.service");
const crypto = require("crypto");
const email_service_2 = require("../core/bull/email.service");
const mongo_service_1 = require("../core/bull/mongo.service");
const cloudinary_service_1 = require("../core/cloudinary/cloudinary.service");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../database/mongo/user.schema");
const mongoose_2 = require("mongoose");
let UserService = class UserService {
    userRepo;
    logger;
    authservice;
    emailService;
    datsource;
    emailQueue;
    mongodata;
    cloudinaryService;
    userModel;
    constructor(userRepo, logger, authservice, emailService, datsource, emailQueue, mongodata, cloudinaryService, userModel) {
        this.userRepo = userRepo;
        this.logger = logger;
        this.authservice = authservice;
        this.emailService = emailService;
        this.datsource = datsource;
        this.emailQueue = emailQueue;
        this.mongodata = mongodata;
        this.cloudinaryService = cloudinaryService;
        this.userModel = userModel;
    }
    async createUser(user, role) {
        const queryRunner = this.datsource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const newuser = { ...user, role: role };
            const isUserExists = await this.userRepo.findOneBy({ email: user.email });
            if (isUserExists) {
                throw new common_1.ConflictException('User already exists');
            }
            const isUserwithNameExists = await this.userRepo.findOneBy({
                username: user.username,
            });
            if (isUserwithNameExists) {
                throw new common_1.ConflictException('User with same name already exists');
            }
            const otp = crypto.randomInt(100000, 999999).toString();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            const USER = {
                ...newuser,
                verificationOtp: otp,
                verificationExpires: otpExpires,
                isVerified: false,
            };
            const createduser = queryRunner.manager.create(user_entity_1.User, USER);
            this.logger.debug('User created and saving');
            await queryRunner.manager.save(user_entity_1.User, createduser);
            await this.emailService.sendMail(USER.email, 'Verification OTP', 'Your verification otp is :' + otp + '. Valid for 10 minutes');
            this.logger.log(`Verification email sent to ${user.email}`);
            await queryRunner.commitTransaction();
            return createduser;
        }
        catch (error) {
            this.logger.error(`Failed to send verification email to ${user.email}`);
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Failed to send verification email. Error: ' + error);
        }
        finally {
            await queryRunner.release();
        }
    }
    async verifyOtp(otp) {
        const user = await this.userRepo.findOneBy({ verificationOtp: otp });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid or Expired OTP');
        }
        user.isVerified = true;
        this.logger.debug('User verified and sending welcome mail');
        await this.emailQueue.queueEmail(user.email, user.username);
        await this.userRepo.save(user);
        this.logger.debug('User creeated and saving to mongodb');
        await this.mongodata.addMongoUser(user.email, user.username);
        this.logger.debug('saved');
    }
    async signin(user, password) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            this.logger.warn(`Failed login attempt for email: ${user.email}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.authservice.createtoken(user);
        return { userId: user.id, message: 'Login successful', token };
    }
    async forgotPassword(email) {
        const user = await this.userRepo.findOneBy({ email: email });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = otpExpires;
        await this.emailService.sendMail(user.email, 'Reset Password OTP', 'Your reset password otp is :' + otp + '. Valid for 10 minutes');
        await this.userRepo.save(user);
    }
    async resetPassword(otp, password) {
        const user = await this.userRepo.findOneBy({ resetPasswordOtp: otp });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid or Expired OTP');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await this.userRepo.save(user);
    }
    async findbyId(userId) {
        const user = await this.userModel
            .findOne({ id: userId })
            .populate('friends');
        return user;
    }
    async findAll() {
        const users = await this.userRepo.find();
        return users;
    }
    async uploadProfilepic(userid, file) {
        const user = await this.userModel.findOne({ id: userid });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.pic_id) {
            await this.cloudinaryService.deleteFile(user.pic_id);
        }
        const response = await this.cloudinaryService.uploadFile(file);
        user.profilepic = response.secure_url;
        user.pic_id = response.public_id;
        await user.save();
        return user.profilepic;
    }
    async deleteProfilepic(userid) {
        const user = await this.userModel.findOne({ id: userid });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.pic_id) {
            await this.cloudinaryService.deleteFile(user.pic_id);
        }
        user.profilepic = '';
        user.pic_id = '';
        await user.save();
    }
    async updateName(userid, name) {
        await this.userModel.findOneAndUpdate({ id: userid }, { $set: { name: name } }, { new: true });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(8, (0, mongoose_1.InjectModel)(user_schema_1.UserData.name)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        logger_service_1.LogService,
        auth_service_1.AuthService,
        email_service_1.EmailService,
        typeorm_2.DataSource,
        email_service_2.EmailProcessor,
        mongo_service_1.MongoService,
        cloudinary_service_1.CloudinaryService,
        mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map