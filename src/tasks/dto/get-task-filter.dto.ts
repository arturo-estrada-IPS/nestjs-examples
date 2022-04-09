import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTaskFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'status should be one of the folowing: OPEN, IN_PROGESS, DONE',
  })
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
