import { Controller, Get } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('me')
  getCurrentUser() {
    return this.sessionService.getCurrentUser();
  }
}