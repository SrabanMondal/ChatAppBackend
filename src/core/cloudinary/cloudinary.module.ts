import { Module } from '@nestjs/common';
import { CloudinaryConfig } from './cloudinary.config';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [CloudinaryConfig],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
