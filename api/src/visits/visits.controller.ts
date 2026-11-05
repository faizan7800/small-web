import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { assertObjectId } from '../common/object-id.js';
import { NavigateDto } from './dto/navigate.dto.js';
import { VisitsService } from './visits.service.js';

@Controller()
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}

  // POST /navigate { personId, address, via } -> { found, site? }   (also records the visit)
  @Post('navigate')
  navigate(@Body() dto: NavigateDto) {
    return this.visits.navigate(dto);
  }

  // GET /people/:id/history?limit=100 -> that person's visits, newest first
  @Get('people/:id/history')
  history(
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ) {
    assertObjectId(id, 'person id');
    return this.visits.history(id, Math.min(Math.max(limit, 1), 500));
  }
}
