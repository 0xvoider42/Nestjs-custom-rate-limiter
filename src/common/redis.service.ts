import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redis from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  redisClient: redis.RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.redisClient = redis.createClient({
      url: this.configService.get('redisUrl'),
    });

    this.redisClient.on('connect', () => {
      console.log('Redis connected');
    });

    this.redisClient.on('error', (err) => {
      console.log('Redis error', err);
    });
  }

  async onModuleInit() {
    await this.redisClient.connect();
  }

  async onModuleDestroy() {
    await this.redisClient.disconnect();
  }
}
