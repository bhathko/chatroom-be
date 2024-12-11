import { IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  readonly account: string;

  @IsString()
  readonly password: string;
}
