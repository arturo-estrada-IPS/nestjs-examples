import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            signUp: jest.fn().mockImplementation(() => Promise.resolve(true)),
            signIn: jest.fn().mockImplementation(() => Promise.resolve(true)),
          }),
        },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    service = moduleRef.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should use AuthService.signUp and resolve to true', async () => {
      const result = await controller.signUp({
        username: 'test',
        name: 'test',
        lastname: 'test',
        password: 'test',
      });

      expect(result).toBe(true);
      expect(service.signUp).toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should use AuthService.signIn and resolve to true', async () => {
      const result = await controller.signIn({
        username: 'test',
        password: 'test',
      });

      expect(result).toBe(true);
      expect(service.signIn).toHaveBeenCalled();
    });
  });
});
