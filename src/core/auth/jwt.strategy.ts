import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/database/sql/entity/user.entity';
import { Repository } from 'typeorm';
import { ConfigVal } from '../config/myconfig.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private config: ConfigVal,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getJwt(),
      ignoreExpiration: false,
    });
  }
  async validate(payload: { id: number; role: string }) {
    const user = await this.userRepo.findOne({
      where: { id: payload.id },
      select: ['id', 'username', 'email', 'role'],
    });
    if (!user) {
      throw new UnauthorizedException('User not authorized');
    }
    return user;
  }
}
