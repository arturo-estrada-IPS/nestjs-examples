import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';

describe('AuthService', () => {
  let service: AuthService;
  let repository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useFactory: () => ({
            createUser: jest.fn(() => Promise.resolve(true)),
            findOne: jest.fn(() => Promise.resolve(true)),
          }),
        },
        {
          provide: JwtService,
          useFactory: () => ({
            sign: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve({ accessToken: 'test' }),
              ),
          }),
        },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    repository = moduleRef.get<UserRepository>(UserRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should sign in user and return an access token', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const signInSpy = jest.spyOn(service, 'signIn');
      const findOneSpy = jest.spyOn(repository, 'findOne');
      const signSpy = jest.spyOn(jwtService, 'sign');

      const result = await service.signIn({
        username: 'test',
        password: 'test',
      });

      expect(findOneSpy).toHaveBeenCalled();
      expect(signSpy).toHaveBeenCalled();
      expect(signInSpy).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
    });

    it('should throw UnauthorizedException an error when password or user are incorrect', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      try {
        await service.signIn({
          username: 'test',
          password: 'test',
        });
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('signUp', () => {
    it('should signUp a new user', async () => {
      const result = await service.signUp({
        username: 'test',
        name: 'Name',
        lastname: 'Lastname',
        password: 'pass',
      });
      expect(result).toBe(true);
    });
  });
});
