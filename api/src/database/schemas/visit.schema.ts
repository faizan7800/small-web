import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

// How the person got to the address. Back and forward are NOT visits: like in a real
// browser they replay entries the person already has, they do not add new history.
export const VIA = ['typed', 'link', 'search', 'history', 'publish'] as const;
export type Via = (typeof VIA)[number];

// A recorded fact: this person arrived at this address at this time, this way.
// History is simply the visits of one person, newest first.
@Schema()
export class Visit {
  @Prop({ type: Types.ObjectId, ref: 'Person', required: true })
  person!: Types.ObjectId;

  // The canonical address when there was one, otherwise what the person typed.
  @Prop({ type: String, required: true })
  address!: string;

  @Prop({ type: Date, required: true })
  at!: Date;

  @Prop({ type: String, enum: VIA, required: true })
  via!: Via;

  // false = "nowhere": there was no such address. Those visits are still history.
  @Prop({ type: Boolean, required: true })
  found!: boolean;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
VisitSchema.index({ person: 1, at: -1 }); // "this person's history, newest first"
