"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_validation_1 = require("../core/validation/user.validation");
const user_controller_1 = require("./user.controller");
const logger_module_1 = require("../core/logger/logger.module");
const logger_service_1 = require("../core/logger/logger.service");
const myconfig_module_1 = require("../core/config/myconfig.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../database/sql/entity/user.entity");
const auth_module_1 = require("../core/auth/auth.module");
const admin_controller_1 = require("./admin.controller");
const role_guard_1 = require("../core/guards/role-guard");
const email_module_1 = require("../core/email/email.module");
const bull_module_1 = require("../core/bull/bull.module");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../database/mongo/user.schema");
const platform_express_1 = require("@nestjs/platform-express");
const multer = require("multer");
const cloudinary_module_1 = require("../core/cloudinary/cloudinary.module");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.UserData.name, schema: user_schema_1.UserDataSchema },
            ]),
            logger_module_1.MyLogger,
            myconfig_module_1.MyConfig,
            auth_module_1.AuthModule,
            email_module_1.EmailModule,
            bull_module_1.MyBull,
            platform_express_1.MulterModule.register({
                storage: multer.memoryStorage(),
                limits: { fileSize: 10 * 1024 * 1024 },
                fileFilter: (req, file, cb) => {
                    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
                    if (!allowedMimeTypes.includes(file.mimetype)) {
                        return cb(new common_1.InternalServerErrorException('Only JPEG, PNG, and GIF images are allowed'), false);
                    }
                    cb(null, true);
                },
            }),
            cloudinary_module_1.CloudinaryModule,
        ],
        controllers: [user_controller_1.UserController, admin_controller_1.AdminController],
        providers: [user_service_1.UserService, user_validation_1.ValidateUserPipe, logger_service_1.LogService, role_guard_1.RoleGuard],
        exports: [user_service_1.UserService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map