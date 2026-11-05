import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

// One page of HTML published at one address.
// We keep the html and the search text on the site itself (not in a second
// collection) because they are always read and written together.
@Schema({ timestamps: true })
export class Site {
  // Canonical form only (see normalizeAddress). Unique, so two people can never own one address.
  @Prop({ type: String, required: true, unique: true })
  address!: string;

  @Prop({ type: String, required: true, trim: true })
  title!: string;

  // ALREADY SANITIZED. We clean once on the way in, and the browser only ever receives clean html.
  @Prop({ type: String, required: true })
  html!: string;

  // Plain words of the page, derived from html. This is what search looks at.
  @Prop({ type: String, required: true })
  text!: string;

  @Prop({ type: Types.ObjectId, ref: 'Person', required: true, index: true })
  author!: Types.ObjectId;
}

export const SiteSchema = SchemaFactory.createForClass(Site);

// Search by what is written in the page. A title match counts 5x more than a body match.
SiteSchema.index({ title: 'text', text: 'text' }, { weights: { title: 5, text: 1 }, name: 'site_text' });
