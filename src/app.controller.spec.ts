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

  describe('/app', () => {
    it('should return "Public message" if public', async () => {
      const response = await service.getPublicMessage();

      expect(response).toEqual({ message: 'Public message' });
    });

    it('should return "Private message" if private', async () => {
      const response = await service.getPrivateMessage();

      expect(response).toEqual({ message: 'Private message' });
    });
  });
});
