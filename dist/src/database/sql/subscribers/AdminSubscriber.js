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
exports.AdminSubscriber = void 0;
const logger_service_1 = require("../../../core/logger/logger.service");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entity/user.entity");
let AdminSubscriber = class AdminSubscriber {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    listenTo() {
        return user_entity_1.User;
    }
    afterInsert(event) {
        const { entity } = event;
        if (entity.role == 'admin') {
            this.logger.log(`Admin user created: ID=${entity.id}, Email=${entity.email}, Username=${entity.username}, CreatedAt=${entity.createdAt.toLocaleString()}`);
        }
    }
    afterUpdate(event) {
        const { entity } = event;
        if (entity &&
            entity instanceof user_entity_1.User &&
            entity.role.toLowerCase() === 'admin') {
            this.logger.log(`Admin user updated: ID=${entity.id}, Email=${entity.email}, Username=${entity.username}, UpdatedAt=${entity.updatedAt.toLocaleString()}`);
        }
    }
};
exports.AdminSubscriber = AdminSubscriber;
exports.AdminSubscriber = AdminSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)(),
    __metadata("design:paramtypes", [logger_service_1.LogService])
], AdminSubscriber);
//# sourceMappingURL=AdminSubscriber.js.map