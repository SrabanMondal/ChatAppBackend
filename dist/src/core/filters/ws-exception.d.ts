import { Socket } from 'socket.io';
import { ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
export type WsClient = Socket;
export interface WsErrorResponse<T = any> {
    status: 'error';
    message: string;
    code: string;
    timestamp: string;
    data: T | null;
}
export interface WsClientData {
    [key: string]: any;
}
export declare class WsExceptionFilter<T extends WsClientData = WsClientData> extends BaseWsExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
