/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { GetUser } from './user.decorator';

describe('GetUser (decorator)', () => {
  function getParamDecoratorFactory(decorator: Function) {
    class Test {
      public test(@decorator() _value) {}
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
    return args[Object.keys(args)[0]].factory;
  }

  it('should use decorator', () => {
    const factory = getParamDecoratorFactory(GetUser);
    const result = factory(null, {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockImplementation(() => ({ user: {} })),
    });

    expect(result).toBeTruthy();
  });
});
