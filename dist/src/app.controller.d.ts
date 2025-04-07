import { AppService } from './app.service';
import { DataSource } from 'typeorm';
export declare class AppController {
    private readonly appService;
    private datasource;
    constructor(appService: AppService, datasource: DataSource);
    getHello(): string;
    checkHealth(): Promise<{
        status: string;
        message: string;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: string;
    }>;
}
