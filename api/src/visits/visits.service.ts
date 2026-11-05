import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { normalizeAddress } from '../common/address.js';
import { Person } from '../database/schemas/person.schema.js';
import { Site } from '../database/schemas/site.schema.js';
import { Visit } from '../database/schemas/visit.schema.js';
import { NavigateDto } from './dto/navigate.dto.js';

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private readonly visits: Model<Visit>,
    @InjectModel(Site.name) private readonly sites: Model<Site>,
    @InjectModel(Person.name) private readonly people: Model<Person>,
  ) {}

  /**
   * "Go to this address." Looks the page up AND records the visit in one call,
   * so a page is never shown without being recorded (and vice versa).
   *
   * Asking for an address that does not exist is not an error: it is a valid
   * outcome, so we answer 200 with found:false and still record it in history.
   */
  async navigate(dto: NavigateDto) {
    const personExists = await this.people.exists({ _id: dto.personId });
    if (!personExists) throw new NotFoundException('No such person');

    const address = normalizeAddress(dto.address);
    const site = address ? await this.sites.findOne({ address }).lean() : null;

    await this.visits.create({
      person: new Types.ObjectId(dto.personId),
      address: address ?? dto.address.slice(0, 200),
      at: new Date(),
      via: dto.via,
      found: site !== null,
    });

    if (!site) return { found: false as const, address: address ?? dto.address };

    const author = await this.people.findById(site.author).lean();
    return {
      found: true as const,
      site: {
        address: site.address,
        title: site.title,
        html: site.html,
        author: { id: String(site.author), name: author?.name ?? 'unknown' },
      },
    };
  }

  /** One person's visits, newest first. Repeat visits are separate entries. */
  async history(personId: string, limit: number) {
    const visits = await this.visits
      .find({ person: new Types.ObjectId(personId) })
      .sort({ at: -1, _id: -1 })
      .limit(limit)
      .lean();

    const found = [...new Set(visits.filter((v) => v.found).map((v) => v.address))];
    const sites = await this.sites.find({ address: { $in: found } }).select('address title').lean();
    const titles = new Map(sites.map((s) => [s.address, s.title]));

    return visits.map((v) => ({
      id: String(v._id),
      address: v.address,
      title: titles.get(v.address) ?? null,
      at: v.at,
      via: v.via,
      found: v.found,
    }));
  }
}
