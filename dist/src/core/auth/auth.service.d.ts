import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/sql/entity/user.entity';
export declare class AuthService {
    private jwtservice;
    constructor(jwtservice: JwtService);
    createtoken(user: User): string;
    decodetoken(token: string): {
        id: number;
        role: string;
    };
}
