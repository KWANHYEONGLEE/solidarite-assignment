import { Expose } from 'class-transformer';

export class UsersDto {
  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  password: string;
}
