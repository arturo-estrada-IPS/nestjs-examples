import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';

describe('JwtStrategy', () => {
  let startegy: JwtStrategy;
  let repository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserRepository,
          useFactory: () => ({
            findOne: jest.fn().mockImplementation(() => Promise.resolve(true)),
          }),
        },
        {
          provide: ConfigService,
          useFactory: () => ({
            get: jest.fn().mockImplementation(() => 'jiberish'),
          }),
        },
      ],
    }).compile();

    startegy = moduleRef.get<JwtStrategy>(JwtStrategy);
    repository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('initialize', () => {
    it('should initialize', () => {
      expect(startegy).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should validate given a username', async () => {
      const result = await startegy.validate({ username: 'username' });
      expect(result).toBe(true);
    });

    it('should throw unauthorized if no username is provided', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await startegy.validate({ username: 'username' });
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
