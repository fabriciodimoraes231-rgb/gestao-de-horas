import { Injectable } from '@nestjs/common';
import { CreateTimeEntryDto } from './domain.types';
import { MockStoreService } from './mock-store.service';

@Injectable()
export class TimeEntriesService {
  constructor(private readonly mockStore: MockStoreService) {}

  getMine() {
    return {
      summary: this.mockStore.getTimeEntrySummaryForCurrentUser(),
      items: this.mockStore.getTimeEntriesForCurrentUser(),
    };
  }

  create(dto: CreateTimeEntryDto) {
    const entry = this.mockStore.createTimeEntryForCurrentUser(dto);

    return {
      message: 'Lançamento registrado com sucesso.',
      entry,
      summary: this.mockStore.getTimeEntrySummaryForCurrentUser(),
    };
  }
}