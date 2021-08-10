import { Body, Post, Res } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Response } from 'express';
import { IsIncludedNumberAndString } from 'src/common/compare';
import { createResData } from 'src/common/respose.constant';
import { LoginDto } from './dto/login.dto';
import { UsersDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller({
  path: 'api/users',
})
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   * 회원가입
   */
  @Post('/join')
  async saveUser(@Res() res: Response, @Body() userDto: UsersDto) {
    // * 유효성 검사(닉네임 10자 이하, 패스워드에 숫자, 문자 포함, 빈 값)
    if (!userDto.email || !userDto.email.trim()) return res.status(400).send(createResData(400, '', '', '이메일을 입력해주세요'));
    if (!userDto.nickname || !userDto.nickname.trim()) return res.status(400).send(createResData(400, '', '', '닉네임을 입력해주세요'));
    if (!userDto.password || !userDto.password.trim()) return res.status(400).send(createResData(400, '', '', '패스워드를 입력해주세요'));
    if (userDto.nickname.trim().length > 10) return res.status(403).send(createResData(403, '', '', '닉네임은 10자 이하여야합니다.'));
    if (!IsIncludedNumberAndString(userDto.password)) return res.status(403).send(createResData(403, '', '', '비밀번호에는 영문과 숫자가 포함되어야 합니다. '));

    // * 회원가입
    const saveUserRes = await this.userService.SignUp(userDto);

    // * return
    //성공
    if (saveUserRes === 'ok') return res.status(201).send({ data: 'OK' });
    //실패(이메일 중복)
    else if (saveUserRes === 'ER_DUP_ENTRY') return res.status(403).send(createResData(403, '', '', '해당 이메일이 이미 존재합니다'));
  }

  /**
   * 로그인
   */
  @Post('/login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    // * 로그인
    const loginUserRes = await this.userService.Login(loginDto);

    // * return
    //실패(존재하지 않은 이메일)
    if (loginUserRes === 'user do not exist') return res.status(403).send(createResData(403, '', '', '존재하지않는 이메일입니다.'));
    //실패(비밀번호 오류)
    else if (loginUserRes === 'password do not match') return res.status(403).send(createResData(403, '', '', '비밀번호가 틀렸습니다.'));
    //성공
    else return res.status(200).send(loginUserRes);
  }
}
