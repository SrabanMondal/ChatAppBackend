import { InternalServerErrorException, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidateUserPipe } from 'src/core/validation/user.validation';
import { UserController } from './user.controller';
import { MyLogger } from 'src/core/logger/logger.module';
import { LogService } from 'src/core/logger/logger.service';
import { MyConfig } from 'src/core/config/myconfig.module';
//import { MySqlModule } from 'src/database/sql/mysql.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/sql/entity/user.entity';
import { AuthModule } from 'src/core/auth/auth.module';
import { AdminController } from './admin.controller';
import { RoleGuard } from 'src/core/guards/role-guard';
import { EmailModule } from 'src/core/email/email.module';
import { MyBull } from 'src/core/bull/bull.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserData, UserDataSchema } from 'src/database/mongo/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CloudinaryModule } from 'src/core/cloudinary/cloudinary.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([
      { name: UserData.name, schema: UserDataSchema },
    ]),
    MyLogger,
    MyConfig,
    AuthModule,
    EmailModule,
    MyBull,
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new InternalServerErrorException(
              'Only JPEG, PNG, and GIF images are allowed',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
    CloudinaryModule,
  ],
  controllers: [UserController, AdminController],
  providers: [UserService, ValidateUserPipe, LogService, RoleGuard],
  exports: [UserService],
})
export class UserModule {}
