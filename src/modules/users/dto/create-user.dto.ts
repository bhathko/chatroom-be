import { IsDate, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsDate()
  readonly lastLogin: Date;
}
