import { Controller, Get } from '@nestjs/common';
import { PeopleService } from './people.service.js';

@Controller('people')
export class PeopleController {
  constructor(private readonly people: PeopleService) {}

  // GET /people  -> who can I browse / publish as?
  @Get()
  list() {
    return this.people.list();
  }
}
