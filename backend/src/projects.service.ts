import { Injectable } from '@nestjs/common';
import { MockStoreService } from './mock-store.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly mockStore: MockStoreService) {}

  getAssignedProjects() {
    return this.mockStore.getAssignedProjectsForCurrentUser();
  }
}