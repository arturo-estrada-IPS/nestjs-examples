import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('API');

  use(request: any, response: any, next: (error?: any) => void) {
    const { ip, method, baseUrl } = request;
    const userAgent = request.get('user-agent');

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${baseUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
