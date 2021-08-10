import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BoardsLikes {
  @PrimaryGeneratedColumn({
    comment: `테이블 고유 인덱스`,
  })
  id: number;

  @Column({
    comment: `Boards(게시물) 테이블의  고유 인덱스`,
  })
  board_id: number;

  @Column({
    comment: `좋아요 누른 유저의 id`,
  })
  userId: number;
}
