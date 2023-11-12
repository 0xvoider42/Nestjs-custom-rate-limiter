import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { CustomAuthGuard } from './common/guards/custom-auth-guard.guard';
import { GetPrivateResponse, GetPublicResponse } from './types';

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPublic(): GetPublicResponse {
    return this.appService.getPublicMessage();
  }

  @Get('/private')
  @UseGuards(CustomAuthGuard)
  getPrivate(): GetPrivateResponse {
    return this.appService.getPrivateMessage();
  }
}
