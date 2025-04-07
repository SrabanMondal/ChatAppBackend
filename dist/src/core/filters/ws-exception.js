"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const websockets_2 = require("@nestjs/websockets");
let WsExceptionFilter = class WsExceptionFilter extends websockets_1.BaseWsExceptionFilter {
    catch(exception, host) {
        const client = host.switchToWs().getClient();
        const errorResponse = {
            status: 'error',
            message: '',
            code: '',
            timestamp: new Date().toISOString(),
            data: null,
        };
        switch (true) {
            case exception instanceof websockets_2.WsException:
                errorResponse.message = exception.getError();
                errorResponse.code = 'WS_ERROR';
                break;
            case exception instanceof Error:
                errorResponse.message = exception.message;
                errorResponse.code = 'GENERIC_ERROR';
                break;
            default:
                errorResponse.message = 'Internal server error';
                errorResponse.code = 'INTERNAL_SERVER_ERROR';
        }
        if ('emit' in client) {
            client.emit('exception', errorResponse);
        }
        else {
            client.send(JSON.stringify({
                event: 'exception',
                data: errorResponse,
            }));
        }
    }
};
exports.WsExceptionFilter = WsExceptionFilter;
exports.WsExceptionFilter = WsExceptionFilter = __decorate([
    (0, common_1.Catch)()
], WsExceptionFilter);
//# sourceMappingURL=ws-exception.js.map