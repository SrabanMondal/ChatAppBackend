"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalvalidationPipe = void 0;
const common_1 = require("@nestjs/common");
const globalvalidationPipe = (config) => new common_1.ValidationPipe({
    transform: true,
    whitelist: true,
    validationError: {
        target: config.getNodeEnv() == 'DEV' ? true : false,
        value: config.getNodeEnv() == 'DEV' ? true : false,
    },
});
exports.globalvalidationPipe = globalvalidationPipe;
//# sourceMappingURL=globalvalidations.js.map