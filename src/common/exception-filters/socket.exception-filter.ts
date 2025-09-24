import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

/**
 * Http Exception -> Socket Exception 으로 변환
 */
@Catch(HttpException)
export class SocketExceptionFilter extends BaseWsExceptionFilter<HttpException> {
	catch(exception: HttpException, host: ArgumentsHost): void {
		const socket = host.switchToWs().getClient();

		socket.emit('exception', {
			data: exception.getResponse(),
		});
	}
}
