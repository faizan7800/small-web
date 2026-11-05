import { Transform } from 'class-transformer';
import { IsMongoId, IsString, MaxLength, MinLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class PublishSiteDto {
  @IsMongoId()
  authorId!: string;

  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  address!: string;

  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  // 100k characters is far more than a one-page site needs, and stops huge uploads.
  @IsString()
  @MinLength(1)
  @MaxLength(100_000)
  html!: string;
}
