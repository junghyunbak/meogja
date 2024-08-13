import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { HttpStatus } from '@nestjs/common';
import { RESPONSE_CODE } from './constants/api';
import { JoinRoomDto } from './dto/join-room.dto';
import { CheckRoomDto } from './dto/check-room.dto';
import { CheckUserDto } from './dto/check-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-room')
  @HttpCode(HttpStatus.CREATED)
  async createRoom(
    @Body() body: CreateRoomDto,
  ): Promise<ResponseTemplate<{ roomId: RoomId }>> {
    const roomId = await this.appService.createRoom(body);

    return {
      data: { roomId },
      code: RESPONSE_CODE.OK,
      message: '성공적으로 방이 생성되었습니다.',
    };
  }

  @Post('join-room')
  @HttpCode(HttpStatus.CREATED)
  async joinRoom(
    @Body() body: JoinRoomDto,
  ): Promise<ResponseTemplate<{ userId: UserId }>> {
    await this.appService.checkRoomIsExist(body.roomId);

    await this.appService.checkRoomIsFull(body.roomId);

    const userId = await this.appService.addUser(body.roomId);

    return {
      data: { userId },
      code: RESPONSE_CODE.OK,
      message: '방에 성공적으로 입장하였습니다.',
    };
  }

  @Get('check-room')
  @HttpCode(HttpStatus.OK)
  async checkRoomId(
    @Query() query: CheckRoomDto,
  ): Promise<ResponseTemplate<object>> {
    const { roomId } = query;

    await this.appService.checkRoomIsExist(roomId);

    return {
      data: {},
      code: RESPONSE_CODE.OK,
      message: '방 아이디 유효성 검사가 통과하였습니다.',
    };
  }

  @Get('check-user-id')
  @HttpCode(HttpStatus.OK)
  async checkUserId(
    @Query() query: CheckUserDto,
  ): Promise<ResponseTemplate<object>> {
    const { roomId, userId } = query;

    await this.appService.checkRoomIsExist(roomId);

    await this.appService.checkUserInRoom(roomId, userId);

    return {
      data: {},
      message: '사용자 아이디 유효성 검사가 통과하였습니다.',
      code: RESPONSE_CODE.OK,
    };
  }
}
