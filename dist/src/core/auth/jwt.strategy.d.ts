import { Strategy } from 'passport-jwt';
import { User } from 'src/database/sql/entity/user.entity';
import { Repository } from 'typeorm';
import { ConfigVal } from '../config/myconfig.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepo;
    private config;
    constructor(userRepo: Repository<User>, config: ConfigVal);
    validate(payload: {
        id: number;
        role: string;
    }): Promise<User>;
}
export {};
