import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  //NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/sql/entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { RegisterUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { LogService } from 'src/core/logger/logger.service';
import { AuthService } from 'src/core/auth/auth.service';
import { EmailService } from 'src/core/email/email.service';
import * as crypto from 'crypto';
import { EmailProcessor } from 'src/core/bull/email.service';
import { MongoService } from 'src/core/bull/mongo.service';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { InjectModel } from '@nestjs/mongoose';
import { UserData, UserDocument } from 'src/database/mongo/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private logger: LogService,
    private authservice: AuthService,
    private emailService: EmailService,
    private datsource: DataSource,
    private emailQueue: EmailProcessor,
    private mongodata: MongoService,
    private cloudinaryService: CloudinaryService,
    @InjectModel(UserData.name) private userModel: Model<UserDocument>,
  ) {}
  async createUser(user: RegisterUserDto, role: string) {
    const queryRunner = this.datsource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newuser = { ...user, role: role };
      const isUserExists = await this.userRepo.findOneBy({ email: user.email });
      if (isUserExists) {
        throw new ConflictException('User already exists');
      }
      const isUserwithNameExists = await this.userRepo.findOneBy({
        username: user.username,
      });
      if (isUserwithNameExists) {
        throw new ConflictException('User with same name already exists');
      }
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      const USER = {
        ...newuser,
        verificationOtp: otp,
        verificationExpires: otpExpires,
        isVerified: false,
      };
      const createduser = queryRunner.manager.create(User, USER);
      this.logger.debug('User created and saving');
      await queryRunner.manager.save(User, createduser);
      await this.emailService.sendMail(
        USER.email,
        'Verification OTP',
        'Your verification otp is :' + otp + '. Valid for 10 minutes',
      );
      this.logger.log(`Verification email sent to ${user.email}`);
      await queryRunner.commitTransaction();
      return createduser;
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${user.email}`);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Failed to send verification email. Error: ' + error,
      );
    } finally {
      await queryRunner.release();
    }
  }
  async verifyOtp(otp: string) {
    const user = await this.userRepo.findOneBy({ verificationOtp: otp });
    if (!user) {
      throw new UnauthorizedException('Invalid or Expired OTP');
    }
    user.isVerified = true;
    this.logger.debug('User verified and sending welcome mail');
    await this.emailQueue.queueEmail(user.email, user.username);
    await this.userRepo.save(user);
    this.logger.debug('User creeated and saving to mongodb');
    await this.mongodata.addMongoUser(user.email, user.username);
    this.logger.debug('saved');
  }
  async signin(user: User, password: string) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Failed login attempt for email: ${user.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.authservice.createtoken(user);
    return { userId: user.id, message: 'Login successful', token };
  }
  async forgotPassword(email: string) {
    const user = await this.userRepo.findOneBy({ email: email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = otpExpires;
    await this.emailService.sendMail(
      user.email,
      'Reset Password OTP',
      'Your reset password otp is :' + otp + '. Valid for 10 minutes',
    );
    await this.userRepo.save(user);
  }
  async resetPassword(otp: string, password: string) {
    const user = await this.userRepo.findOneBy({ resetPasswordOtp: otp });
    if (!user) {
      throw new UnauthorizedException('Invalid or Expired OTP');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await this.userRepo.save(user);
  }
  async findbyId(userId: number) {
    const user = await this.userModel
      .findOne({ id: userId })
      .populate('friends');
    return user;
  }
  async findAll() {
    const users = await this.userRepo.find();
    return users;
  }
  async uploadProfilepic(userid: number, file: Express.Multer.File) {
    const user = await this.userModel.findOne({ id: userid });
    if (!user) {
      throw new NotFoundException('User not found');
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
  async deleteProfilepic(userid: number) {
    const user = await this.userModel.findOne({ id: userid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.pic_id) {
      await this.cloudinaryService.deleteFile(user.pic_id);
    }
    user.profilepic = '';
    user.pic_id = '';
    await user.save();
  }

  async updateName(userid: number, name: string) {
    await this.userModel.findOneAndUpdate(
      { id: userid },
      { $set: { name: name } },
      { new: true },
    );
  }
}
