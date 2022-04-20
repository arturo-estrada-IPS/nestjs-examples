import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppLoggerMiddleware } from './request.middleware';

describe('AppLoggerMiddleware', () => {
  let middleware: AppLoggerMiddleware;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AppLoggerMiddleware],
    }).compile();

    middleware = moduleRef.get<AppLoggerMiddleware>(AppLoggerMiddleware);
  });

  it('should initialize', () => {
    expect(middleware).toBeDefined();
    expect(middleware.use).toBeDefined();
  });

  it('should call use with params and log', () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'log');

    const mockRequest = {
      ip: '1.1.1.1',
      method: 'GET',
      baseUrl: '/test',
      get: jest.fn(),
    };

    const moctResponse = {
      on: jest.fn((_name: string, callback: () => void) => callback()),
      get: jest.fn(),
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockNext = () => {};

    middleware.use(mockRequest, moctResponse, mockNext);

    expect(loggerSpy).toHaveBeenCalled();
  });
});
