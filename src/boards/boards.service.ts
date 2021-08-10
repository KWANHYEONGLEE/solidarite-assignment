import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createResData, ServerErrorStr } from 'src/common/respose.constant';
import { Users } from 'src/users/entity/users';
import { Connection, Repository } from 'typeorm';
import { SaveBoardsDto } from './dto/saveBoards.dto';
import { Boards } from './entity/boards.entity';
import { BoardsLikes } from './entity/boards_likes.entity';
import { BoardsResponse } from './response/boards.response';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Boards)
    private boardsRepository: Repository<Boards>,
    @InjectRepository(BoardsLikes)
    private boardsLikesRepository: Repository<BoardsLikes>,
    private connection: Connection,
  ) {}

  /**
   * 게시글 저장
   * @param userDto
   */
  async saveBoards(user: Users, saveBoardsDto: SaveBoardsDto): Promise<BoardsResponse | string> {
    // * 저장할 데이터 선언 및 정의
    const boardEntity = new Boards();
    boardEntity.userId = user.id;
    boardEntity.nickname = user.nickname;
    boardEntity.title = saveBoardsDto.title;
    boardEntity.content = saveBoardsDto.content;

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // * 게시물 저장하기
      const saveBoards = await this.boardsRepository.save(boardEntity);
      await queryRunner.commitTransaction();

      // * returnData 선언 및 정의
      const returnData: BoardsResponse = {
        id: saveBoards.id,
        userId: saveBoards.userId,
        user: {
          nickname: saveBoards.nickname,
        },
        title: saveBoards.title,
        content: saveBoards.content,
        like: saveBoards.like,
        createdAt: saveBoards.createdAt,
      };

      // * return
      return returnData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(createResData(500, null, ServerErrorStr), HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 게시물 전체 조회하기
   */
  async getBoards(): Promise<BoardsResponse[]> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //* 게시물 전체 조회하기
      const findBoardsRes = await this.boardsRepository.find();
      await queryRunner.commitTransaction();

      // * returnData 선언하기
      const returnData: BoardsResponse[] = [];

      // * returnData정의하기
      for (let i = 0; i < findBoardsRes.length; i++) {
        const board = findBoardsRes[i];

        const data: BoardsResponse = {
          id: board.id,
          userId: board.userId,
          user: {
            nickname: board.nickname,
          },
          title: board.title,
          content: board.content,
          like: board.like,
          createdAt: board.createdAt,
        };
        returnData.push(data);
      }
      // * 게시물 리스트 정보 return
      return returnData;
    } catch (error) {
      //서버 오류로인한 에러 발생
      await queryRunner.rollbackTransaction();
      throw new HttpException(createResData(500, null, ServerErrorStr), HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 게시물 상세 조회하기
   * @param id
   */
  async getOneBoard(user: any, id: number): Promise<BoardsResponse | string> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //* 로그인을 한 상태라면 해당 유저가 좋아요를 눌렀는지 확인하기
      let isLike = false;
      if (user) {
        const checkBoardLike = await this.boardsLikesRepository.findOne({ board_id: id, userId: user.id });
        if (checkBoardLike) isLike = true;
      }

      //* 게시물 상세 조회하기
      const findOneBoardRes = await this.boardsRepository.findOne(id);
      await queryRunner.commitTransaction();

      //* 해당 번호의 게시물이 없을경우
      if (!findOneBoardRes) return 'board do not exit';

      //* 해당 번호의 게시물이 있을경우
      // * returnData 선언 및 정의
      const returnData: BoardsResponse = {
        id: findOneBoardRes.id,
        userId: findOneBoardRes.userId,
        user: {
          nickname: findOneBoardRes.nickname,
        },
        title: findOneBoardRes.title,
        content: findOneBoardRes.content,
        like: findOneBoardRes.like,
        isLike: isLike,
        createdAt: findOneBoardRes.createdAt,
      };

      // * 게시물 상세 정보 return
      return returnData;
    } catch (error) {
      //서버 오류로인한 에러 발생
      await queryRunner.rollbackTransaction();
      throw new HttpException(createResData(500, null, ServerErrorStr), HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 게시물 삭제
   * @param user
   * @param id
   */
  async deleteBoard(user: Users, id: number): Promise<string> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //* 게시물 삭제하기
      const findOneBoardRes = await this.boardsRepository.findOne(id);
      await queryRunner.commitTransaction();

      //* 해당 번호의 게시물이 없을경우
      if (!findOneBoardRes) return 'board do not exit';
      //* 해당 게시물의 작성자가 아닐경우
      if (findOneBoardRes.userId !== user.id) return 'id do not match';

      //* 해당 번호의 게시물이 있을경우
      //게시물 삭제하기
      await this.boardsRepository.delete({ id: id });

      // * return
      return 'OK';
    } catch (error) {
      //서버 오류로인한 에러 발생
      await queryRunner.rollbackTransaction();
      throw new HttpException(createResData(500, null, ServerErrorStr), HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 게시물 좋아요
   * @param user
   * @param id
   */
  async likeBoard(user: Users, id: number): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // * boards_likes테이블에서 해당 유저가 게시물에 좋아요 눌렀는지 확인하기
      const findOneBoardLike = await this.boardsLikesRepository.findOne({ id: id, userId: user.id });

      // * 해당 유저가 이전에 좋아요를 누르지않았을경우
      if (!findOneBoardLike) {
        //게시물 좋아요 수 증가
        await this.boardsRepository.increment({ id: id }, 'like', 1);
        //boards_like테이블 save
        await this.boardsLikesRepository.save({ board_id: id, userId: user.id });
      }

      // * 게시물 정보 조회하기
      const findOneBoard = await this.boardsRepository.findOne(id);
      await queryRunner.commitTransaction();

      // * returnData 선언 및 정의
      const returnData: BoardsResponse = {
        id: findOneBoard.id,
        userId: findOneBoard.userId,
        user: {
          nickname: findOneBoard.nickname,
        },
        title: findOneBoard.title,
        content: findOneBoard.content,
        like: findOneBoard.like,
        isLike: true,
        createdAt: findOneBoard.createdAt,
      };

      // * return
      return returnData;
    } catch (error) {
      //서버 오류로인한 에러 발생
      await queryRunner.rollbackTransaction();
      throw new HttpException(createResData(500, null, ServerErrorStr), HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
}
