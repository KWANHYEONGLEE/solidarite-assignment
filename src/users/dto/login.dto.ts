import { Expose } from 'class-transformer';

export class LoginDto {
  @Expose()
  readonly email: string;

  @Expose()
  readonly password: string;
}
