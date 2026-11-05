import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person } from '../database/schemas/person.schema.js';

@Injectable()
export class PeopleService {
  constructor(@InjectModel(Person.name) private readonly people: Model<Person>) {}

  async list() {
    const people = await this.people.find().sort({ name: 1 }).lean();
    return people.map((p) => ({ id: String(p._id), name: p.name }));
  }
}
