/* eslint-disable @typescript-eslint/no-empty-function */
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';

describe('TaskRepository', () => {
  let repository: TaskRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TaskRepository],
    }).compile();

    repository = moduleRef.get<TaskRepository>(TaskRepository);
  });

  describe('TaskRepository init', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });
  });

  describe('getTasks', () => {
    it('should call and use query (no params)', async () => {
      const queryBuilderSpy = jest
        .spyOn(Repository.prototype, 'createQueryBuilder')
        .mockReturnValue(SelectQueryBuilder.prototype);

      const whereSpy = jest
        .spyOn(SelectQueryBuilder.prototype, 'where')
        .mockReturnThis();

      const getManySpy = jest
        .spyOn(SelectQueryBuilder.prototype, 'getMany')
        .mockReturnThis();

      await repository.getTasks({ status: null, search: null }, null);

      expect(queryBuilderSpy).toHaveBeenCalled();
      expect(whereSpy).toHaveBeenCalled();
      expect(getManySpy).toHaveBeenCalled();
    });

    it('should call and use query (with params)', async () => {
      const queryBuilderSpy = jest
        .spyOn(Repository.prototype, 'createQueryBuilder')
        .mockReturnValue(SelectQueryBuilder.prototype);

      const whereSpy = jest
        .spyOn(SelectQueryBuilder.prototype, 'where')
        .mockReturnThis();

      const getManySpy = jest
        .spyOn(SelectQueryBuilder.prototype, 'getMany')
        .mockReturnThis();

      const andWhereSpy = jest
        .spyOn(SelectQueryBuilder.prototype, 'andWhere')
        .mockReturnThis();

      await repository.getTasks(
        { status: TaskStatus.OPEN, search: 'test' },
        null,
      );

      expect(queryBuilderSpy).toHaveBeenCalled();
      expect(whereSpy).toHaveBeenCalled();
      expect(andWhereSpy).toHaveBeenCalled();
      expect(getManySpy).toHaveBeenCalled();
    });

    it('should call and throw error', async () => {
      jest
        .spyOn(Repository.prototype, 'createQueryBuilder')
        .mockReturnValue(SelectQueryBuilder.prototype);

      jest.spyOn(SelectQueryBuilder.prototype, 'where').mockReturnThis();

      jest
        .spyOn(SelectQueryBuilder.prototype, 'getMany')
        .mockImplementationOnce(() => Promise.reject(false));

      try {
        await repository.getTasks({ status: null, search: null }, {
          username: 'test',
        } as any);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('createTask', () => {
    it('should call and use Repository.create and Repository.save', async () => {
      const createSpy = jest
        .spyOn(Repository.prototype, 'create')
        .mockReturnValue(null);

      const saveSpy = jest
        .spyOn(Repository.prototype, 'save')
        .mockReturnValue(Promise.resolve(true));

      await repository.createTask({ title: 'test', description: 'test' }, {
        username: 'test',
      } as any);

      expect(createSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
    });
  });
});
