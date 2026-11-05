import { BadRequestException } from '@nestjs/common';

const OBJECT_ID = /^[a-f0-9]{24}$/i;

export function assertObjectId(value: string, name = 'id'): string {
  if (!OBJECT_ID.test(value)) throw new BadRequestException(`${name} is not a valid id`);
  return value;
}
