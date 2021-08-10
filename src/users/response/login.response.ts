export class LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}
