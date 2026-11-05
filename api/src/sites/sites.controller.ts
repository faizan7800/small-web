import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PublishSiteDto } from './dto/publish-site.dto.js';
import { SitesService } from './sites.service.js';

@Controller()
export class SitesController {
  constructor(private readonly sites: SitesService) {}

  // GET /sites -> directory of all sites
  @Get('sites')
  list() {
    return this.sites.list();
  }

  // POST /sites { authorId, address, title, html } -> publish (or replace your own page)
  @Post('sites')
  publish(@Body() dto: PublishSiteDto) {
    return this.sites.publish(dto);
  }

  // GET /search?q=fog -> pages ranked by what is written in them
  @Get('search')
  search(@Query('q') q = '') {
    return this.sites.search(String(q));
  }
}
