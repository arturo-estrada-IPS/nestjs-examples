import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasks: Task[] = [
    {
      id: 'someid1',
      title: 'Test1',
      description: 'Test desc 1',
      status: TaskStatus.OPEN,
      user: null,
    },
    {
      id: 'someid2',
      title: 'Test2',
      description: 'Test desc 2',
      status: TaskStatus.OPEN,
      user: null,
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useFactory: () => ({
            getTasks: jest.fn(() => mockTasks),
            getTaskById: jest.fn(() => mockTasks[0]),
            addTask: jest.fn(() => true),
            updateTaskStatus: jest.fn(() => ({
              ...mockTasks[0],
              status: TaskStatus.IN_PROGRESS,
            })),
            deleteTask: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    controller = moduleRef.get<TasksController>(TasksController);
    service = moduleRef.get<TasksService>(TasksService);
  });

  describe('getTasks', () => {
    it('should call TasksService.getTasks and return list of tasks', async () => {
      const result = await controller.getTasks(null, null);
      expect(result).toEqual(mockTasks);
      expect(service.getTasks).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('should call TasksService.getTaskById and return value', async () => {
      const result = await controller.getTaskById('someid1', null);
      expect(result).toEqual(mockTasks[0]);
      expect(service.getTaskById).toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('should call TasksService.addTask and return true', async () => {
      const result = await controller.createTask(
        {
          title: 'Test3',
          description: 'Test desc 3',
        },
        null,
      );
      expect(result).toBe(true);
      expect(service.addTask).toHaveBeenCalled();
    });
  });

  describe('updateTaskStatus', () => {
    it('should call TasksService.updateTaskStatus and set to IN_PROGRESS', async () => {
      const status = TaskStatus.IN_PROGRESS;
      const result = await controller.updateTaskStatus(
        'someid1',
        { status },
        null,
      );

      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
      expect(service.updateTaskStatus).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should call TasksService.deleteTask and return true', async () => {
      const result = await controller.deleteTask('someid', null);
      expect(result).toBe(true);
      expect(service.deleteTask).toHaveBeenCalled();
    });
  });
});
