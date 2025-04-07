export interface MyConfig {
    SQL_URI: string;
    PORT: number;
    NODE_ENV: 'DEV' | 'PROD';
    FRONTEND: string;
    JWT: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    MONGO_URI: string;
    REDIS_PASS: string;
}
