import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTimeEntryDto } from './domain.types';
import { TimeEntriesService } from './time-entries.service';

@Controller('time-entries')
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Get('mine')
  getMine() {
    return this.timeEntriesService.getMine();
  }

  @Post()
  create(@Body() body: CreateTimeEntryDto) {
    return this.timeEntriesService.create(body);
  }
}