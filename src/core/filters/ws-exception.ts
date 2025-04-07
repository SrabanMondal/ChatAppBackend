import { Socket } from 'socket.io';
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets';

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

@Catch()
export class WsExceptionFilter<
  T extends WsClientData = WsClientData,
> extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<WsClient>();
    //const data = host.switchToWs().getData<T>();

    const errorResponse: WsErrorResponse<T> = {
      status: 'error',
      message: '',
      code: '',
      timestamp: new Date().toISOString(),
      data: null,
    };

    // Type-safe exception handling
    switch (true) {
      case exception instanceof WsException:
        errorResponse.message = exception.getError() as string;
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

    // Type assertion for the client emit method
    if ('emit' in client) {
      (client as Socket).emit('exception', errorResponse);
    } else {
      (client as WebSocket).send(
        JSON.stringify({
          event: 'exception',
          data: errorResponse,
        }),
      );
    }
  }
}
