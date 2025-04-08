import { ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
export type WsClient = Socket;
export interface WsClientData {
    [key: string]: any;
}
export interface WsErrorResponse<T = any> {
    status: 'error';
    message: string;
    code: string;
    timestamp: string;
    data: T | null;
}
export declare class WsExceptionFilter<T extends WsClientData = WsClientData> extends BaseWsExceptionFilter {
    private readonly logger;
    catch(exception: WsException | Error, host: ArgumentsHost): void;
}
