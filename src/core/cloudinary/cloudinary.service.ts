import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { CloudinaryConfigVal } from './cloudinary.configval';
@Injectable()
export class CloudinaryService {
  constructor(private readonly config: CloudinaryConfigVal) {
    cloudinary.config({
      cloud_name: this.config.getCloudinaryConfig().CLOUDINARY_CLOUD_NAME,
      api_key: this.config.getCloudinaryConfig().CLOUDINARY_API_KEY,
      api_secret: this.config.getCloudinaryConfig().CLOUDINARY_API_SECRET,
    });
  }
  async uploadFile(file: Express.Multer.File, folder: string = 'chatnest') {
    return await new Promise<UploadApiResponse>((resolve, reject) => {
      if (!file || !file.buffer) {
        return reject(new Error('Invalid file or buffer is missing.'));
      }
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error || !result) {
            return reject(
              new InternalServerErrorException(
                `Upload failed: ${error?.message || 'Unknown error'}`,
              ),
            );
          } else {
            resolve(result);
          }
        },
      );
      const stream = Readable.from(file.buffer);
      stream.pipe(uploadStream);
      uploadStream.on('error', (streamerror) => {
        reject(
          new InternalServerErrorException(
            `Stream error: ${streamerror.message}`,
          ),
        );
      });
    });
  }
  async deleteFile(publicId: string): Promise<{ result: string }> {
    try {
      const result = (await cloudinary.uploader.destroy(publicId)) as {
        result: string;
      };
      if (!result || result.result !== 'ok') {
        throw new InternalServerErrorException(
          'Failed to delete file from Cloudinary',
        );
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete file: ${(error as Error).message}`,
      );
    }
  }
  extractPublicId(imageUrl: string): string {
    const parts = imageUrl.split('/');
    const publicIdWithExtension = parts.slice(7).join('/');
    return publicIdWithExtension.replace(/\.[^.]+$/, '');
  }
}
