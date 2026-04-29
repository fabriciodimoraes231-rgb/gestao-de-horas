import { Injectable } from '@nestjs/common';
import { MockStoreService } from './mock-store.service';

@Injectable()
export class SessionService {
  constructor(private readonly mockStore: MockStoreService) {}

  getCurrentUser() {
    return this.mockStore.getCurrentUser();
  }
}