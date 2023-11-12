import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import defaultConfig from './common/config/index';
import { IPRateLimiter, TokenRateLimiter } from './common/rate-limiter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [defaultConfig],
      isGlobal: true,
      envFilePath: '.env',
    }),
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
