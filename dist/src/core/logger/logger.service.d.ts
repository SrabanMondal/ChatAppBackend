import { LoggerService as NestLogger } from '@nestjs/common';
import { ConfigVal } from '../config/myconfig.service';
export declare class LogService implements NestLogger {
    private logger;
    constructor(config: ConfigVal);
    log(message: string): void;
    error(message: string, trace?: string): void;
    warn(message: string): void;
    debug(message: string): void;
    verbose(message: string): void;
}
