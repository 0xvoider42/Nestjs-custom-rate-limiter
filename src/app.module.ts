import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as redisStore from 'cache-manager-redis-store';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import defaultConfig from './common/config/index';
import { IPRateLimiter, TokenRateLimiter } from './common/rate-limiter';
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [defaultConfig],
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore as unknown as CacheStore,
      host: '127.0.0.1',
      port: 6379,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    AuthModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IPRateLimiter).forRoutes('/app');
    consumer.apply(TokenRateLimiter).forRoutes('/app/private');
  }
}
