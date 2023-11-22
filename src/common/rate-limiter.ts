import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';

@Injectable()
export class IPRateLimiter implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const clientIp = req.ip;
    const checkCache = await this.cacheManager.get(clientIp);

    if (!checkCache) {
      await this.cacheManager.set(clientIp, 0);
    }

    const maxRequests = this.configService.get('rateLimitIP');

    const requestCount: number = await this.cacheManager.get(clientIp);
    requestCount + 1;

    await this.cacheManager.set(clientIp, requestCount);

    const resetInterval = 60 * 60 * 1000;
    if (requestCount > maxRequests) {
      const timeUntilReset = Math.ceil(resetInterval / 1000 / 60);

      return res.status(429).send({
        message: `Too Many Requests! MAX for the user: ${maxRequests}. Next request available in: ${timeUntilReset} min.`,
      });
    }

    setTimeout(async () => {
      await this.cacheManager.set(clientIp, 0);
    }, resetInterval);

    next();
  }
}

@Injectable()
export class TokenRateLimiter implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const userToken = req.headers.authorization;
    const checkCache = await this.cacheManager.get(userToken);

    if (!checkCache) {
      await this.cacheManager.set(userToken, 0);
    }

    const maxRequests = this.configService.get('rateLimitToken');

    const requestCount: number = await this.cacheManager.get(userToken);
    requestCount + 1;

    await this.cacheManager.set(userToken, requestCount);

    const resetInterval = 60 * 60 * 1000;
    if (requestCount > maxRequests) {
      const timeUntilReset = Math.ceil(resetInterval / 1000 / 60);

      return res.status(429).send({
        message: `Too Many Requests! MAX for the user: ${maxRequests}. Next request available in: ${timeUntilReset} min.`,
      });
    }

    setTimeout(async () => {
      await this.cacheManager.set(userToken, 0);
    }, resetInterval);

    next();
  }
}
