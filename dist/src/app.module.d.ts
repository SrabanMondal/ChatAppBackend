import { OnModuleInit } from '@nestjs/common';
import { LogService } from './core/logger/logger.service';
import { DataSource } from 'typeorm';
import { Connection } from 'mongoose';
export declare class AppModule implements OnModuleInit {
    private readonly logger;
    private datasource;
    private connection;
    constructor(logger: LogService, datasource: DataSource, connection: Connection);
    onModuleInit(): Promise<void>;
}
