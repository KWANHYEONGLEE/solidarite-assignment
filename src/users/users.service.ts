import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { convertTextToSHA256 } from 'src/common/encryptData';
import { createResData, ServerErrorStr } from 'src/common/respose.constant';
import { Connection, Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { UsersDto } from './dto/users.dto';
import { Users } from './entity/users';
import { LoginResponse } from './response/login.response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private connection: Connection,
    private jwtService: JwtService,
  ) {}

  /**
   * 유저 저장
   * @param userDto
   */
  async SignUp(usersDto: UsersDto): Promise<string> {
    // * 비밀번호 암호화(SHA256)
    usersDto.password = convertTextToSHA256(usersDto.password);

    // * UsersDTO -> UsersEntity
    const usersEntity = plainToClass(Users, usersDto);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.userRepository.save(usersEntity);
      await queryRunner.commitTransaction();

      // * return(성공)
      return 'ok';
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // * return(실패) - email중복 or serverError
      if (error.code === 'ER_DUP_ENTRY') return 'ER_DUP_ENTRY';
      else throw new HttpException(createResData(500, null, ServerErrorStr), HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 로그인
   * @param LoginDto
   */
  async Login(loginDto: LoginDto): Promise<LoginResponse | string> {
    //* 파라미터 데이터 분리하기
    const { email, password } = loginDto;

    //* 비밀번호 암호화(SHA256)(회원 비밀번호와 비교하기위해서)
    const encryptedPassword = convertTextToSHA256(password);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //* 유저정보 받아오기(by email)
      const findUserRes = await this.userRepository.findOne({ email: email });
      await queryRunner.commitTransaction();

      //*존재하지않은 이메일이거나 password가 다를경우 error return
      if (!findUserRes) return 'user do not exist';
      if (findUserRes.password !== encryptedPassword) return 'password do not match';

      //*JWT 토큰 발급하기
      const token = this.createToken(findUserRes.id);

      //*returnData:LoginResponse 생성
      const returnData: LoginResponse = {
        token: token,
        user: {
          id: findUserRes.id,
          email: findUserRes.email,
          nickname: findUserRes.nickname,
        },
      };

      //* return하기
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
   * 유저 id로 유저 정보 얻기
   */
  async getUserById(userId: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //* 유저 정보 조회
      const findUserRes = await this.userRepository.findOne({ id: userId });
      await queryRunner.commitTransaction();

      // * 유저정보 return
      return findUserRes;
    } catch (error) {
      //서버 오류로인한 에러 발생
      await queryRunner.rollbackTransaction();
      throw new HttpException(createResData(500, null, ServerErrorStr), HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * jwt 토큰 발행
   */
  public createToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECREAT_KEY,
      expiresIn: 3600,
    });
    return token;
  }
}
