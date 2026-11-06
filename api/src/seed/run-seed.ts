import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module.js';
import { SeedService } from './seed.service.js';

async function main() {
  const app = await NestFactory.createApplicationContext(SeedModule, { logger: ['error', 'warn'] });
  const result = await app.get(SeedService).run();
  console.log(`Seeded: ${result.people} people, ${result.sites} sites, ${result.visits} visits`);
  await app.close();
}

void main();
