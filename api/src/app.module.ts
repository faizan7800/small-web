import { Module } from '@nestjs/common';
import { PeopleModule } from './people/people.module.js';
import { SitesModule } from './sites/sites.module.js';
import { VisitsModule } from './visits/visits.module.js';

@Module({ imports: [PeopleModule, SitesModule, VisitsModule] })
export class AppModule {}
