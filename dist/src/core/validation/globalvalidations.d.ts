import { ValidationPipe } from '@nestjs/common';
import { ConfigVal } from '../config/myconfig.service';
export declare const globalvalidationPipe: (config: ConfigVal) => ValidationPipe;
