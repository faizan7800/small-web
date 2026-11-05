import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './schemas/person.schema.js';
import { Site, SiteSchema } from './schemas/site.schema.js';
import { Visit, VisitSchema } from './schemas/visit.schema.js';

// One place that connects to MongoDB and registers the three models.
// Feature modules import this module instead of repeating the setup.
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/small-web'),
    MongooseModule.forFeature([
      { name: Person.name, schema: PersonSchema },
      { name: Site.name, schema: SiteSchema },
      { name: Visit.name, schema: VisitSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
