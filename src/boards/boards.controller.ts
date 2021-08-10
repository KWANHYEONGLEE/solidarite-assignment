import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { SaveBoardsDto } from './dto/saveBoards.dto';
import { Response } from 'express';
import JwtAuthGuard from 'src/auth/guard/jwtAuth.guard';
import { createResData } from 'src/common/respose.constant';

@Controller('api/boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  /**
   * 게시물 생성
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async saveBoards(@Req() req, @Res() res: Response, @Body() saveBoardsDto: SaveBoardsDto) {
    // * JWT를 이용하여 User정보 받아오기
    const { user } = req;

    // * 유효한 토큰이 아닐 경우 401에러 반환
    if (!user) return res.status(401).send(createResData(401, '', '', '권한이 없습니다.'));

    // * 유효성 검사(빈 값, title 길이 제한)
    if (!saveBoardsDto.title || !saveBoardsDto.title.trim()) return res.status(400).send(createResData(400, '', '', '제목을 입력해주세요'));
    if (!saveBoardsDto.content || !saveBoardsDto.content.trim()) return res.status(400).send(createResData(400, '', '', '내용을 입력해주세요'));
    if (saveBoardsDto.title.trim().length > 30) return res.status(403).send(createResData(403, '', '', '제목은 30자 이하여야합니다.'));

    // * 게시물 작성하기
    const saveBoardsRes = await this.boardsService.saveBoards(user, saveBoardsDto);

    // * return
    return res.status(201).send(saveBoardsRes);
  }

  /**
   * 게시물 삭제
   */
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteBoard(@Req() req, @Res() res: Response, @Param('id') id: number) {
    // * JWT를 이용하여 User정보 받아오기
    const { user } = req;

    // * 유효한 토큰이 아닐 경우 401에러 반환
    if (!user) return res.status(401).send(createResData(401, '', '', '권한이 없습니다.'));

    // * 게시물 삭제하기
    const saveBoardsRes = await this.boardsService.deleteBoard(user, id);

    //* return
    if (saveBoardsRes === 'board do not exit') return res.status(404).send(createResData(404, '', '', '해당 번호의 게시물은 없습니다.'));
    if (saveBoardsRes === 'id do not match') return res.status(401).send(createResData(401, '', '', '해당 게시물의 작성자가 아닙니다.'));
    else return res.status(204).send({ data: saveBoardsRes });
  }

  /**
   * 게시물 좋아요
   */
  @UseGuards(JwtAuthGuard)
  @Post('/:id/like')
  async likeBoard(@Req() req, @Res() res: Response, @Param('id') id: number) {
    // * JWT를 이용하여 User정보 받기
    const { user } = req;

    // * 유효한 토큰이 아닐 경우 401에러 반환
    if (!user) return res.status(401).send(createResData(401, '', '', '권한이 없습니다.'));

    // * 게시물 좋아요
    const likeBoardsRes = await this.boardsService.likeBoard(user, id);

    // * return
    return res.status(201).send(likeBoardsRes);
  }

  /**
   * 게시물 상세조회
   */
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getOneboard(@Req() req, @Res() res: Response, @Param('id') id: number) {
    // * JWT를 이용하여 User정보 받기
    const { user } = req;

    //* 게시물 상세 조회하기
    const getOneBoardRes = await this.boardsService.getOneBoard(user, id);

    //* return
    if (getOneBoardRes === 'board do not exit') return res.status(404).send(createResData(404, '', '', '해당 번호의 게시물은 없습니다.'));
    else return res.status(200).send(getOneBoardRes);
  }

  /**
   * 게시물 리스토 조회
   */
  @Get()
  async getBoards(@Res() res: Response) {
    //* 게시물 리스트 조회하기
    const getBoardsRes = await this.boardsService.getBoards();

    //* return
    return res.status(200).send(getBoardsRes);
  }
}
