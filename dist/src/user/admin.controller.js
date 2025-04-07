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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const hash_password_1 = require("../core/validation/hash-password");
const user_service_1 = require("./user.service");
const user_dto_1 = require("./user.dto");
const user_validation_1 = require("../core/validation/user.validation");
const roles_decorator_1 = require("../core/decorators/roles.decorator");
const passport_1 = require("@nestjs/passport");
const role_guard_1 = require("../core/guards/role-guard");
let AdminController = class AdminController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async register(user) {
        const createduser = await this.userService.createUser(user, 'admin');
        return {
            id: createduser.id,
            username: createduser.username,
            email: createduser.email,
            role: createduser.role,
            createdAt: createduser.createdAt,
            updatedAt: createduser.updatedAt,
        };
    }
    async login(logindata) {
        const { user, password } = logindata;
        const { userId, message, token } = await this.userService.signin(user, password);
        return { userId, message, token };
    }
    async findAllUsers() {
        const users = await this.userService.findAll();
        return users;
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.UsePipes)(new hash_password_1.HashPassword()),
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "register", null);
__decorate([
    (0, common_1.UsePipes)(user_validation_1.ValidateUserPipe),
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), role_guard_1.RoleGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.Admin),
    (0, common_1.Get)('getusers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAllUsers", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)({
        version: '1',
        path: 'admin',
    }),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map