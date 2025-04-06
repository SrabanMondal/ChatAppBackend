import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/sql/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtservice: JwtService) {}
  createtoken(user: User) {
    const payload = { id: user.id, role: user.role };
    const token = this.jwtservice.sign(payload);
    return token;
  }
  decodetoken(token: string) {
    const payload = this.jwtservice.verify<{ id: number; role: string }>(token);
    return payload;
  }
}
