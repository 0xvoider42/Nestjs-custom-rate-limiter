import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello() {
    return { message: 'This is public!' };
  }

  getPrivateMessage() {
    return { message: 'This is private!' };
  }
}
