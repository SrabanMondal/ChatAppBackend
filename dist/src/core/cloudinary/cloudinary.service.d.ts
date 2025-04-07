import { UploadApiResponse } from 'cloudinary';
import { CloudinaryConfigVal } from './cloudinary.configval';
export declare class CloudinaryService {
    private readonly config;
    constructor(config: CloudinaryConfigVal);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<UploadApiResponse>;
    deleteFile(publicId: string): Promise<{
        result: string;
    }>;
    extractPublicId(imageUrl: string): string;
}
