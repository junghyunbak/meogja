import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { HttpStatus } from '@nestjs/common';
import { RESPONSE_CODE } from './constants/api';
import { JoinRoomDto } from './dto/join-room.dto';

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
    await this.appService.checkRoomIsValid(body.roomId);

    const userId = await this.appService.addUser(body.roomId);

    return {
      data: { userId },
      code: RESPONSE_CODE.OK,
      message: '방에 성공적으로 입장하였습니다.',
    };
  }
}
