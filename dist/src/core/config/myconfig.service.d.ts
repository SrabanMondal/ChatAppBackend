import { ConfigService } from '@nestjs/config';
export declare class ConfigVal {
    private configService;
    private config;
    constructor(configService: ConfigService);
    getSqlUri(): string;
    getNodeEnv(): 'DEV' | 'PROD';
    getPort(): number;
    getFrontend(): string;
    getJwt(): string;
    getUser(): string;
    getPass(): string;
    getRedisHost(): string;
    getRedisPort(): number;
    getMongoUri(): string;
    getRedisPass(): string;
    getRedisUrl(): string;
}
