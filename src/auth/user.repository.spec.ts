import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;

  const mockUser: User = {
    id: 'someid',
    username: 'test',
    password: 'test',
    name: 'test',
    lastname: 'test',
    tasks: [],
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('initialize', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });
  });

  describe('createUser', () => {
    it('should create user and save', async () => {
      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('jiberish'));

      const genSaltSpy = jest
        .spyOn(bcrypt, 'genSalt')
        .mockImplementation(() => Promise.resolve('jiberish'));

      const createSpy = jest
        .spyOn(Repository.prototype, 'create')
        .mockImplementation(() => mockUser);

      const saveSpy = jest
        .spyOn(Repository.prototype, 'save')
        .mockImplementation(() => Promise.resolve(true));

      await repository.createUser({
        name: 'test',
        lastname: 'test',
        username: 'test',
        password: 'test',
      });

      expect(hashSpy).toHaveBeenCalled();
      expect(genSaltSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
    });

    it('should throw conflict error', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('jiberish'));

      jest
        .spyOn(bcrypt, 'genSalt')
        .mockImplementation(() => Promise.resolve('jiberish'));

      jest
        .spyOn(Repository.prototype, 'create')
        .mockImplementation(() => mockUser);

      jest
        .spyOn(Repository.prototype, 'save')
        .mockImplementation(() => Promise.reject({ code: '23505' }));

      try {
        await repository.createUser({
          name: 'test',
          lastname: 'test',
          username: 'test',
          password: 'test',
        });
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
    });

    it('should throw internal server error', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('jiberish'));

      jest
        .spyOn(bcrypt, 'genSalt')
        .mockImplementation(() => Promise.resolve('jiberish'));

      jest
        .spyOn(Repository.prototype, 'create')
        .mockImplementation(() => mockUser);

      jest
        .spyOn(Repository.prototype, 'save')
        .mockImplementation(() => Promise.reject(false));

      try {
        await repository.createUser({
          name: 'test',
          lastname: 'test',
          username: 'test',
          password: 'test',
        });
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
