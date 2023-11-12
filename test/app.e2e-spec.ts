import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/app (GET)', () => {
    it('should return "This is public!"', async () => {
      return request(app.getHttpServer())
        .get('/app')
        .expect(200)
        .then((res) => {
          expect(res.body.message).toEqual('This is public!');
        });
    });

    it('should return "This is private!"', async () => {
      return request(app.getHttpServer())
        .get('/app/private')
        .set({
          Authorization: `${process.env.USER_TOKEN}`,
        })
        .expect(200)
        .then((res) => {
          expect(res.body.message).toEqual('This is private!');
        });
    });
  });
});
