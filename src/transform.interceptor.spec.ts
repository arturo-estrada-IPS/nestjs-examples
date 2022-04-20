import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TransformInterceptor],
    }).compile();

    interceptor = moduleRef.get<TransformInterceptor>(TransformInterceptor);
  });

  it('should initialize', () => {
    expect(interceptor).toBeDefined();
    expect(interceptor.intercept).toBeDefined();
  });

  it('should intercept and handle request', () => {
    const mockNext = {
      handle: jest.fn(() => of({})),
    };

    interceptor.intercept(null, mockNext);

    expect(mockNext.handle).toHaveBeenCalled();
  });
});
