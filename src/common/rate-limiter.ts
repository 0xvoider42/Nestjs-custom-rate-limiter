import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class IPRateLimiter implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  private requestCount = new Map<string, number>();

  use(req: Request, res: Response, next: () => void) {
    const clientIp = req.ip;

    if (!this.requestCount.has(clientIp)) {
      this.requestCount.set(clientIp, 0);
    }

    const maxRequests = this.configService.get('rateLimitIP');

    const requestCount = this.requestCount.get(clientIp) + 1;
    this.requestCount.set(clientIp, requestCount);

    const resetInterval = 60 * 60 * 1000;
    if (requestCount > maxRequests) {
      return res.status(429).send('Too Many Requests');
    }

    setTimeout(() => {
      this.requestCount.set(clientIp, 0);
    }, resetInterval);

    next();
  }
}

@Injectable()
export class TokenRateLimiter implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  private requestCount = new Map<string, number>();

  use(req: Request, res: Response, next: () => void) {
    const userToken = req.headers.authorization;

    if (!this.requestCount.has(userToken)) {
      this.requestCount.set(userToken, 0);
    }

    const maxRequests = this.configService.get('rateLimitToken');

    const requestCount = this.requestCount.get(userToken) + 1;
    this.requestCount.set(userToken, requestCount);

    const resetInterval = 60 * 60 * 1000;
    if (requestCount > maxRequests) {
      return res.status(429).send('Too Many Requests');
    }

    setTimeout(() => {
      this.requestCount.set(userToken, 0);
    }, resetInterval);

    next();
  }
}
