import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { normalizeAddress } from '../common/address.js';
import { htmlToText, sanitizeSiteHtml } from '../common/html.js';
import { makeSnippet } from '../common/snippet.js';
import { Person } from '../database/schemas/person.schema.js';
import { Site } from '../database/schemas/site.schema.js';
import { PublishSiteDto } from './dto/publish-site.dto.js';

const SEARCH_LIMIT = 20;
const DUPLICATE_KEY = 11000;

@Injectable()
export class SitesService implements OnModuleInit {
  constructor(
    @InjectModel(Site.name) private readonly sites: Model<Site>,
    @InjectModel(Person.name) private readonly people: Model<Person>,
  ) {}

  // $text queries fail until the text index exists, so wait for the indexes at startup.
  async onModuleInit() {
    await this.sites.init();
  }

  /** Directory of every site. Handy for a "browse all" view. */
  async list() {
    const [sites, people] = await Promise.all([
      this.sites.find().sort({ address: 1 }).select('address title author').lean(),
      this.people.find().lean(),
    ]);
    const names = new Map(people.map((p) => [String(p._id), p.name]));
    return sites.map((s) => ({
      address: s.address,
      title: s.title,
      author: { id: String(s.author), name: names.get(String(s.author)) ?? 'unknown' },
    }));
  }

  /**
   * Publish a page at an address.
   *  - new address            -> created
   *  - your own address       -> the page is REPLACED (edit = replace, no versions)
   *  - someone else's address -> 409
   */
  async publish(dto: PublishSiteDto) {
    const address = normalizeAddress(dto.address);
    if (!address) throw new BadRequestException('Address must look like name.zz (letters, numbers, hyphens)');

    const author = await this.people.findById(dto.authorId).lean();
    if (!author) throw new NotFoundException('No such person');

    const html = sanitizeSiteHtml(dto.html); // the security-critical line
    const text = htmlToText(html);
    if (!text) throw new BadRequestException('The page has no visible text after cleaning');
    const fields = { title: dto.title, html, text, author: author._id };

    // 1) Try to replace a page this person already owns. Putting author in the
    //    filter makes "is it mine?" and "update it" ONE atomic step.
    const replaced = await this.sites.findOneAndUpdate({ address, author: author._id }, { $set: fields });
    if (replaced) return { address, title: dto.title, replaced: true };

    // 2) Otherwise create. If the address already exists, the unique index rejects
    //    it - that means it belongs to someone else.
    try {
      await this.sites.create({ address, ...fields });
    } catch (error) {
      if ((error as { code?: number }).code === DUPLICATE_KEY) {
        throw new ConflictException(`${address} already belongs to someone else`);
      }
      throw error;
    }
    return { address, title: dto.title, replaced: false };
  }

  /** Full-text search over title and page text, best match first. */
  async search(rawQuery: string) {
    const query = rawQuery.trim().slice(0, 200);
    if (!query) return [];
    const rows = await this.sites
      .find(
        { $text: { $search: query } },
        { address: 1, title: 1, text: 1, score: { $meta: 'textScore' } },
      )
      .sort({ score: { $meta: 'textScore' } })
      .limit(SEARCH_LIMIT)
      .lean<Array<{ address: string; title: string; text: string; score: number }>>();
    return rows.map((r) => ({
      address: r.address,
      title: r.title,
      snippet: makeSnippet(r.text, query),
      score: Number(r.score.toFixed(3)),
    }));
  }
}
