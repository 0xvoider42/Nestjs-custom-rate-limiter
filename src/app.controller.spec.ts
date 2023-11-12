import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AppModule } from './app.module';

describe('AppController', () => {
  let app: TestingModule;
  let service: AppService;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = await app.resolve(AppService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('root', () => {
    it('should return "This is public!" if public', () => {
      const response = service.getHello();

      expect(response).toEqual({ message: 'This is public!' });
    });

    it('should return "This is private!" if private', () => {
      const response = service.getPrivateMessage();

      expect(response).toEqual({ message: 'This is private!' });
    });
  });
});
