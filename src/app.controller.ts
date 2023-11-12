import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { CustomAuthGuard } from './common/guards/custom-auth-guard.guard';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPublic() {
    return this.appService.getHello();
  }

  @Get('private')
  @UseGuards(CustomAuthGuard)
  getPrivate() {
    return this.appService.getPrivateMessage();
  }
}
