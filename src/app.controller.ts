import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

import { AppService } from './app.service';
import { CustomAuthGuard } from './common/guards/custom-auth-guard.guard';
import { GetPrivateResponse, GetPublicResponse } from './types';

@UseInterceptors(CacheInterceptor)
@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/create')
  async createMessages() {
    await this.appService.create();
  }

  @Get()
  async getPublic(): Promise<GetPublicResponse> {
    return await this.appService.getPublicMessage();
  }

  @Get('/private')
  @UseGuards(CustomAuthGuard)
  async getPrivate(): Promise<GetPrivateResponse> {
    return await this.appService.getPrivateMessage();
  }
}
