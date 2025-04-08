import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
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

@Catch(WsException, Error)
export class WsExceptionFilter<
  T extends WsClientData = WsClientData,
> extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name);

  catch(exception: WsException | Error, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<WsClient>();
    const data = host.switchToWs().getData<T>();

    const errorResponse: WsErrorResponse<T> = {
      status: 'error',
      message: '',
      code: '',
      timestamp: new Date().toISOString(),
      data: data || null,
    };

    if (exception instanceof WsException) {
      errorResponse.message = exception.getError() as string;
      errorResponse.code = 'WS_ERROR';
    } else if (exception instanceof Error) {
      errorResponse.message = exception.message;
      errorResponse.code = 'GENERIC_ERROR';
      this.logger.error(
        `WebSocket error: ${exception.message}`,
        exception.stack,
      );
    } else {
      errorResponse.message = 'Internal server error';
      errorResponse.code = 'INTERNAL_SERVER_ERROR';
      this.logger.error('Unknown WebSocket error', exception);
    }

    if ('emit' in client) {
      (client as Socket).emit('exception', errorResponse);
    } else {
      this.logger.warn(
        'Non-Socket.IO client detected, sending raw WebSocket message',
      );
      (client as WebSocket).send(
        JSON.stringify({ event: 'exception', data: errorResponse }),
      );
    }

    client.disconnect();
  }
}
