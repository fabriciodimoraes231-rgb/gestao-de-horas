import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'gestao-de-horas-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
