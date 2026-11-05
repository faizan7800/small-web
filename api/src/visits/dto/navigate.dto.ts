import { Transform } from 'class-transformer';
import { IsIn, IsMongoId, IsString, MaxLength } from 'class-validator';
import { VIA } from '../../database/schemas/visit.schema.js';

export class NavigateDto {
  @IsMongoId()
  personId!: string;

  // Whatever was typed or linked. It is NOT required to be a valid address:
  // asking for an address that does not exist is a normal thing to do ("nowhere").
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(200)
  address!: string;

  @IsIn(VIA)
  via!: (typeof VIA)[number];
}
