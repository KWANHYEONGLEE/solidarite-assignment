import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { Users } from 'src/users/entity/users';
import { UsersService } from 'src/users/users.service';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Boards } from './entity/boards.entity';
import { BoardsLikes } from './entity/boards_likes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Boards]),
    TypeOrmModule.forFeature([BoardsLikes]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_SECREAT_KEY,
        signOptions: {
          expiresIn: `${process.env.JWT_EXPIRATION_TIME}s`,
        },
      }),
    }),
  ],
  controllers: [BoardsController],
  providers: [BoardsService, JwtStrategy, UsersService],
})
export class BoardsModule {}
