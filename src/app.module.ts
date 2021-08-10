import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/entity/users';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { Boards } from './boards/entity/boards.entity';
import { BoardsLikes } from './boards/entity/boards_likes.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Users, Boards, BoardsLikes],
      synchronize: true,
    }),
    UsersModule,
    BoardsModule,
  ],
})
export class AppModule {}
