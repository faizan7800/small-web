import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { htmlToText, sanitizeSiteHtml } from '../common/html.js';
import { Person } from '../database/schemas/person.schema.js';
import { Site } from '../database/schemas/site.schema.js';
import { Visit, type Via } from '../database/schemas/visit.schema.js';
import { PEOPLE, SITES, TRAILS } from './data.js';

// A fixed moment, so every run produces the exact same timestamps.
const SEED_START = Date.UTC(2026, 10, 2, 9, 0, 0);
const HISTORY_SPAN_MS = 58 * 60 * 1000; // the whole trail fits inside about an hour

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Person.name) private readonly people: Model<Person>,
    @InjectModel(Site.name) private readonly sites: Model<Site>,
    @InjectModel(Visit.name) private readonly visits: Model<Visit>,
  ) {}

  /**
   * Safe to run any number of times:
   *  - people and sites are UPSERTED by name / address (never duplicated)
   *  - history is deleted for the seeded people and rebuilt from fixed data
   * Sites that someone published later at other addresses are left alone.
   */
  async run() {
    await this.sites.init();

    await this.people.bulkWrite(
      PEOPLE.map((name) => ({
        updateOne: { filter: { name }, update: { $setOnInsert: { name } }, upsert: true },
      })),
    );
    const people = await this.people.find({ name: { $in: PEOPLE } }).lean();
    const idByName = new Map(people.map((p) => [p.name, p._id]));

    await this.sites.bulkWrite(
      SITES.map((site) => {
        const html = sanitizeSiteHtml(site.html); // seeded pages go through the same cleaning as published ones
        return {
          updateOne: {
            filter: { address: site.address },
            update: { $set: { title: site.title, html, text: htmlToText(html), author: idByName.get(site.author)! } },
            upsert: true,
          },
        };
      }),
    );

    const known = new Set(SITES.map((s) => s.address));
    await this.visits.deleteMany({ person: { $in: [...idByName.values()] } });

    const visits = PEOPLE.flatMap((name, personIndex) => {
      const trail = TRAILS[name] ?? [];
      return trail.map((step, i) => {
        const [address, via]: [string, Via] = typeof step === 'string' ? [step, i === 0 ? 'typed' : 'link'] : step;
        const offset = Math.round((i * HISTORY_SPAN_MS) / Math.max(trail.length - 1, 1));
        return {
          person: idByName.get(name)!,
          address,
          via,
          found: known.has(address),
          at: new Date(SEED_START + offset + personIndex * 7_000),
        };
      });
    });
    await this.visits.insertMany(visits);

    return { people: PEOPLE.length, sites: SITES.length, visits: visits.length };
  }
}
