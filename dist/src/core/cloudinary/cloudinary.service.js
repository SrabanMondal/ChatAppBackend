"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const cloudinary_configval_1 = require("./cloudinary.configval");
let CloudinaryService = class CloudinaryService {
    config;
    constructor(config) {
        this.config = config;
        cloudinary_1.v2.config({
            cloud_name: this.config.getCloudinaryConfig().CLOUDINARY_CLOUD_NAME,
            api_key: this.config.getCloudinaryConfig().CLOUDINARY_API_KEY,
            api_secret: this.config.getCloudinaryConfig().CLOUDINARY_API_SECRET,
        });
    }
    async uploadFile(file, folder = 'chatnest') {
        return await new Promise((resolve, reject) => {
            if (!file || !file.buffer) {
                return reject(new Error('Invalid file or buffer is missing.'));
            }
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: 'auto' }, (error, result) => {
                if (error || !result) {
                    return reject(new common_1.InternalServerErrorException(`Upload failed: ${error?.message || 'Unknown error'}`));
                }
                else {
                    resolve(result);
                }
            });
            const stream = stream_1.Readable.from(file.buffer);
            stream.pipe(uploadStream);
            uploadStream.on('error', (streamerror) => {
                reject(new common_1.InternalServerErrorException(`Stream error: ${streamerror.message}`));
            });
        });
    }
    async deleteFile(publicId) {
        try {
            const result = (await cloudinary_1.v2.uploader.destroy(publicId));
            if (!result || result.result !== 'ok') {
                throw new common_1.InternalServerErrorException('Failed to delete file from Cloudinary');
            }
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to delete file: ${error.message}`);
        }
    }
    extractPublicId(imageUrl) {
        const parts = imageUrl.split('/');
        const publicIdWithExtension = parts.slice(7).join('/');
        return publicIdWithExtension.replace(/\.[^.]+$/, '');
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cloudinary_configval_1.CloudinaryConfigVal])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map