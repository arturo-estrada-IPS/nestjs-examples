import { AppModule } from './app.module';

describe('AppModule', () => {
  let moduleRef: AppModule;
  const consumerMock = {
    apply: jest.fn().mockReturnThis(),
    forRoutes: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    moduleRef = new AppModule();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
    expect(moduleRef.configure).toBeDefined();
  });

  it('should apply middleware', () => {
    moduleRef.configure(consumerMock);
    expect(consumerMock.apply).toBeCalled();
    expect(consumerMock.forRoutes).toBeCalled();
  });
});
