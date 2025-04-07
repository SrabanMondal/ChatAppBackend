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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const hash_password_1 = require("../core/validation/hash-password");
const user_service_1 = require("./user.service");
const user_dto_1 = require("./user.dto");
const user_validation_1 = require("../core/validation/user.validation");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    check() {
        return { message: 'User controller is working' };
    }
    async register(user) {
        const createduser = await this.userService.createUser(user, 'user');
        return { message: 'Otp sent to ' + createduser.email, status: true };
    }
    async updatepassword(otp) {
        await this.userService.verifyOtp(otp);
        return { message: 'OTP verified successfully' };
    }
    async login(logindata) {
        const { user, password } = logindata;
        const { userId, message, token } = await this.userService.signin(user, password);
        return { userId, message, token };
    }
    async forgotPassword(email) {
        await this.userService.forgotPassword(email);
        return { message: 'Password reset OTP sent to your email' };
    }
    async resetPassword({ otp, password }) {
        await this.userService.resetPassword(otp, password);
        return { message: 'Password reset successfully' };
    }
    async addPhoto(req, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const pic = await this.userService.uploadProfilepic(req.user.id, file);
        return { message: pic };
    }
    async deletePhoto(req) {
        await this.userService.deleteProfilepic(req.user.id);
        return { message: 'Profile picture deleted successfully' };
    }
    async findById(req) {
        const user = req.user;
        const mongoUser = await this.userService.findbyId(user.id);
        return { user, mongoUser };
    }
    async updateName(req, name) {
        await this.userService.updateName(req.user.id, name);
        return { message: 'Name updated successfully' };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "check", null);
__decorate([
    (0, common_1.UsePipes)(new hash_password_1.HashPassword()),
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/verifyotp'),
    __param(0, (0, common_1.Body)('otp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatepassword", null);
__decorate([
    (0, common_1.UsePipes)(user_validation_1.ValidateUserPipe),
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/forgetPassword'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('/resetPassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('/addprofilepic'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addPhoto", null);
__decorate([
    (0, common_1.Delete)('deleteprofilepic'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deletePhoto", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)('name'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateName", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)({
        version: '1',
        path: 'user',
    }),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map