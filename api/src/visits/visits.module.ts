import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { VisitsController } from './visits.controller.js';
import { VisitsService } from './visits.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}
