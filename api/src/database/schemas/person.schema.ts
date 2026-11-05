import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Someone who browses and/or publishes. There are no accounts or passwords:
// you pick a name from a list, and that name is who the history belongs to.
@Schema({ timestamps: true })
export class Person {
  @Prop({ type: String, required: true, unique: true, trim: true })
  name!: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
