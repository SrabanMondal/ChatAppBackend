import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface CloudinaryConfig {
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

@Injectable()
export class CloudinaryConfigVal {
  private config: CloudinaryConfig;
  constructor(private configService: ConfigService) {
    const api_key = configService.get<string>('CLOUDINARY_API_KEY');
    const api_secret = configService.get<string>('CLOUDINARY_API_SECRET');
    const cloud_name = configService.get<string>('CLOUDINARY_CLOUD_NAME');
    if (!cloud_name) {
      throw new BadRequestException('Missing CLOUDINARY_CLOUD_NAME');
    }
    if (!api_key) {
      throw new BadRequestException('Missing CLOUDINARY_API_KEY');
    }
    if (!api_secret) {
      throw new BadRequestException('Missing CLOUDINARY_API_SECRET');
    }
    this.config = {
      CLOUDINARY_API_KEY: api_key,
      CLOUDINARY_API_SECRET: api_secret,
      CLOUDINARY_CLOUD_NAME: cloud_name,
    };
  }
  getCloudinaryConfig(): CloudinaryConfig {
    return this.config;
  }
}
