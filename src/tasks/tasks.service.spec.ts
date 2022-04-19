import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let repository: TaskRepository;

  const mockUser = {
    id: 'someid',
    name: 'Test',
    lastname: 'Test',
    username: 'user@domain.com',
    password: 'someTest',
    tasks: [],
  };

  const mockTask: Task = {
    id: 'someid',
    title: 'Test',
    description: 'Test desc',
    status: TaskStatus.OPEN,
    user: mockUser,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: () => ({
            getTasks: jest.fn(() => []),
            findOne: jest.fn(),
            createTask: jest.fn(() => true),
            save: jest.fn(),
            delete: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    service = moduleRef.get<TasksService>(TasksService);
    repository = moduleRef.get<TaskRepository>(TaskRepository);
  });

  describe('Initialize', () => {
    it('should create service', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getTasks', () => {
    it('should call TaskRepository.getTasks', () => {
      expect(repository.getTasks).not.toBeCalled();
      const result = service.getTasks(null, mockUser);
      expect(repository.getTasks).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getTasksById', () => {
    it('should call TaskRepository.findeOne and return result', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockTask);
      const result = await service.getTaskById('test', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('should call TaskRepository.findeOne and throw error', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.getTaskById('someid', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addTask', () => {
    it('should call TaskRepository.createTask and return value', async () => {
      expect(repository.createTask).not.toHaveBeenCalled();
      const result = await service.addTask(mockTask, mockUser);
      expect(repository.createTask).toHaveBeenCalledWith(mockTask, mockUser);
      expect(result).toBe(true);
    });
  });

  describe('updateTaskStatus', () => {
    it('should call TaskRepository.save and update status', async () => {
      const status = TaskStatus.IN_PROGRESS;
      (repository.findOne as jest.Mock).mockResolvedValue(mockTask);
      (repository.save as jest.Mock).mockResolvedValue({ ...mockTask, status });
      const result = await service.updateTaskStatus(
        'someid',
        { status },
        mockUser,
      );
      expect(result.status).toEqual(status);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should call TaskRepository.delete and return true', () => {
      service.deleteTask(mockTask.id, mockUser);
      expect(repository.delete).toBeCalledWith({
        id: mockTask.id,
        user: mockUser,
      });
    });
  });
});
