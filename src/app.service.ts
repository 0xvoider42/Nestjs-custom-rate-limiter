import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GetPrivateResponse, GetPublicResponse } from './types';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getPublicMessage(): GetPublicResponse {
    return { message: 'This is public!' };
  }

  getPrivateMessage(): GetPrivateResponse {
    return { message: 'This is private!' };
  }
}
