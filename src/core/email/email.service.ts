import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigVal } from '../config/myconfig.service';
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(private config: ConfigVal) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.getUser(),
        pass: config.getPass(),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.config.getUser(),
      to,
      subject,
      text,
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
