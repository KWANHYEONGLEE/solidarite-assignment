import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({
    comment: `테이블 고유 인덱스`,
  })
  id: number;

  @Column({
    comment: `유저 이메일(중복X = unique)`,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 10,
    comment: `닉네임(영문 + 숫자), length:10`,
  })
  nickname: string;

  @Column({
    type: `text`,
    comment: `비밀번호 (암호)`,
  })
  password: string;
}
