import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, {
    message: 'status should be one of the folowing: OPEN, IN_PROGESS, DONE',
  })
  status: TaskStatus;
}
