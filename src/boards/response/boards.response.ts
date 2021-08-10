import { Exclude } from 'class-transformer';

@Exclude()
export class BoardsResponse {
  id: number;

  userId: number;

  user: {
    nickname: string;
  };

  title: string;

  content: string;

  like: number;

  isLike?: boolean;

  createdAt: string;
}
