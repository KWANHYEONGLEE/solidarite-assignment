import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Boards {
  @PrimaryGeneratedColumn({
    comment: `테이블 고유 인덱스`,
  })
  id: number;

  @Column({
    comment: `게시글 작성자의 고유 id`,
  })
  userId: number;

  @Column({
    type: 'varchar',
    length: 10,
    comment: `닉네임(영문 + 숫자), length:10`,
  })
  nickname: string;

  @Column({
    comment: `게시물 제목`,
    length: 30,
  })
  title: string;

  @Column({
    type: 'text',
    comment: `게시물 내용`,
  })
  content: string;

  @Column({
    comment: `게시물 좋아요 개수`,
    default: 0,
  })
  like: number;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '게시글 생성될 때(자동생성)',
  })
  createdAt: string;
}
