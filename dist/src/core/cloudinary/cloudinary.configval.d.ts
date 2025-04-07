import { ConfigService } from '@nestjs/config';
interface CloudinaryConfig {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
}
export declare class CloudinaryConfigVal {
    private configService;
    private config;
    constructor(configService: ConfigService);
    getCloudinaryConfig(): CloudinaryConfig;
}
export {};
