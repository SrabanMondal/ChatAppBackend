import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/sql/entity/user.entity';
import { ConfigVal } from '../config/myconfig.service';
import { MyConfig } from '../config/myconfig.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [MyConfig],
      inject: [ConfigVal],
      useFactory: (config: ConfigVal) => ({
        secret: config.getJwt(),
        signOptions: { expiresIn: '6h' },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    MyConfig,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
