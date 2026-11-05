import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { SitesController } from './sites.controller.js';
import { SitesService } from './sites.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
