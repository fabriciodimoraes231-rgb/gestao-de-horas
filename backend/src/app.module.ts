import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MockStoreService } from './mock-store.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { TimeEntriesController } from './time-entries.controller';
import { TimeEntriesService } from './time-entries.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    SessionController,
    ProjectsController,
    TimeEntriesController,
  ],
  providers: [
    AppService,
    MockStoreService,
    SessionService,
    ProjectsService,
    TimeEntriesService,
  ],
})
export class AppModule {}
