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
exports.MongoService = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const typeorm_1 = require("@nestjs/typeorm");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../database/mongo/user.schema");
const user_entity_1 = require("../../database/sql/entity/user.entity");
const typeorm_2 = require("typeorm");
let MongoService = class MongoService {
    userRepo;
    addUserQueue;
    usermodel;
    constructor(userRepo, addUserQueue, usermodel) {
        this.userRepo = userRepo;
        this.addUserQueue = addUserQueue;
        this.usermodel = usermodel;
    }
    async addMongoUser(email, name) {
        await this.addUserQueue.add('add_user', { email, name }, {
            attempts: 2,
            backoff: 2000,
        });
    }
    async handleAddData(job) {
        const user = await this.userRepo.findOneBy({ email: job.data.email });
        if (!user) {
            throw new common_1.NotFoundException('User not found in database');
        }
        const id = user.id;
        const { name } = job.data;
        const existUser = await this.usermodel.findOne({ id: id }).exec();
        if (existUser) {
            throw new common_1.ConflictException('User already exists in mongodb');
        }
        const newUser = new this.usermodel({ id, name });
        return newUser.save();
    }
};
exports.MongoService = MongoService;
__decorate([
    (0, bull_1.Process)('add_user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MongoService.prototype, "handleAddData", null);
exports.MongoService = MongoService = __decorate([
    (0, bull_1.Processor)('mongo'),
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, bull_1.InjectQueue)('mongo')),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.UserData.name)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object, mongoose_2.Model])
], MongoService);
//# sourceMappingURL=mongo.service.js.map