import { Test, TestingModule } from '@nestjs/testing';
import { IPRateLimiter, TokenRateLimiter } from './rate-limiter';
import { ConfigService } from '@nestjs/config';

describe('RateLimiter', () => {
  let ipRateLimiter: IPRateLimiter;
  let tokenRateLimiter: TokenRateLimiter;
  let userToken;
  let mockIP;
  let mockResponse;
  let mockNext;
  let mockConfigService;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'rateLimitIP':
            return 100;
          case 'rateLimitToken':
            return 200;
          default:
            return;
        }
      }),
    };

    const RateLimiterFixture: TestingModule = await Test.createTestingModule({
      providers: [
        IPRateLimiter,
        TokenRateLimiter,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    ipRateLimiter = RateLimiterFixture.get<IPRateLimiter>(IPRateLimiter);
    tokenRateLimiter =
      RateLimiterFixture.get<TokenRateLimiter>(TokenRateLimiter);

    mockIP = {
      ip: '127.0.0.1',
    };
    userToken = {
      headers: {
        authorization: process.env.USER_TOKEN,
      },
    };
    mockResponse = {
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('IPRateLimiter', () => {
    it('should allow requests below the rate limit', () => {
      for (let i = 0; i < 5; i++) {
        ipRateLimiter.use(mockIP, mockResponse, mockNext);
      }

      expect(mockNext).toHaveBeenCalledTimes(5);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });

    it('should reject requests above the rate limit', () => {
      for (let i = 0; i < 1001; i++) {
        ipRateLimiter.use(mockIP, mockResponse, mockNext);
      }

      expect(mockNext).toHaveBeenCalledTimes(100);
      expect(mockResponse.status).toHaveBeenCalledWith(429);
      expect(mockResponse.send).toHaveBeenCalledWith('Too Many Requests');
    });
  });

  describe('TokenLimiter', () => {
    it('should allow requests below the rate limit', () => {
      for (let i = 0; i < 5; i++) {
        tokenRateLimiter.use(userToken, mockResponse, mockNext);
      }

      expect(mockNext).toHaveBeenCalledTimes(5);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });

    it('should reject requests above the rate limit', () => {
      for (let i = 0; i < 1001; i++) {
        tokenRateLimiter.use(userToken, mockResponse, mockNext);
      }

      expect(mockNext).toHaveBeenCalledTimes(200);
      expect(mockResponse.status).toHaveBeenCalledWith(429);
      expect(mockResponse.send).toHaveBeenCalledWith('Too Many Requests');
    });
  });
});
