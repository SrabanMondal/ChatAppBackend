import { ConfigVal } from '../config/myconfig.service';
export declare class EmailService {
    private config;
    private transporter;
    constructor(config: ConfigVal);
    sendMail(to: string, subject: string, text: string, html?: string): Promise<void>;
}
