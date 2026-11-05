import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { PeopleController } from './people.controller.js';
import { PeopleService } from './people.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
