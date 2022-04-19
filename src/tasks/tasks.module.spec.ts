/* eslint-disable @typescript-eslint/no-empty-function */
import { TasksModule } from './tasks.module';

describe('TasksModule', () => {
  it('module sould be defined', async () => {
    const moduleRef = new TasksModule();
    expect(moduleRef).toBeDefined();
  });
});
