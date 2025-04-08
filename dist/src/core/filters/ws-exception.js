"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WsExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const websockets_2 = require("@nestjs/websockets");
let WsExceptionFilter = WsExceptionFilter_1 = class WsExceptionFilter extends websockets_1.BaseWsExceptionFilter {
    logger = new common_1.Logger(WsExceptionFilter_1.name);
    catch(exception, host) {
        const client = host.switchToWs().getClient();
        const data = host.switchToWs().getData();
        const errorResponse = {
            status: 'error',
            message: '',
            code: '',
            timestamp: new Date().toISOString(),
            data: data || null,
        };
        if (exception instanceof websockets_2.WsException) {
            errorResponse.message = exception.getError();
            errorResponse.code = 'WS_ERROR';
        }
        else if (exception instanceof Error) {
            errorResponse.message = exception.message;
            errorResponse.code = 'GENERIC_ERROR';
            this.logger.error(`WebSocket error: ${exception.message}`, exception.stack);
        }
        else {
            errorResponse.message = 'Internal server error';
            errorResponse.code = 'INTERNAL_SERVER_ERROR';
            this.logger.error('Unknown WebSocket error', exception);
        }
        if ('emit' in client) {
            client.emit('exception', errorResponse);
        }
        else {
            this.logger.warn('Non-Socket.IO client detected, sending raw WebSocket message');
            client.send(JSON.stringify({ event: 'exception', data: errorResponse }));
        }
        client.disconnect();
    }
};
exports.WsExceptionFilter = WsExceptionFilter;
exports.WsExceptionFilter = WsExceptionFilter = WsExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(websockets_2.WsException, Error)
], WsExceptionFilter);
//# sourceMappingURL=ws-exception.js.map