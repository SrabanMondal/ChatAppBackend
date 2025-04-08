"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const myconfig_service_1 = require("./core/config/myconfig.service");
const globalvalidations_1 = require("./core/validation/globalvalidations");
const globalexception_1 = require("./core/filters/globalexception");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(myconfig_service_1.ConfigVal);
    const port = config.getPort();
    app.enableCors({
        origin: config.getNodeEnv() == 'DEV' ? '*' : config.getFrontend(),
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
        ],
        credentials: true,
    });
    app.useGlobalPipes((0, globalvalidations_1.globalvalidationPipe)(config));
    app.useGlobalFilters(new globalexception_1.GlobalException(app.get(core_1.HttpAdapterHost)));
    app.enableShutdownHooks();
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    await app.listen(port ?? 10000);
    console.log(`Server running on port ${port}`);
}
bootstrap()
    .then(() => console.log('Application Started'))
    .catch((err) => {
    console.error('Application failed to start:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map