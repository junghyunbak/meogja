import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { HttpStatus } from '@nestjs/common';
import { RESPONSE_CODE } from './constants/api';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-room')
  @HttpCode(HttpStatus.CREATED)
  async createRoom(
    @Body() body: CreateRoomDto,
  ): Promise<ResponseTemplate<{ roomId: RoomId }>> {
    const roomId = await this.appService.createRoom(body);

    return { data: { roomId }, code: RESPONSE_CODE.OK, message: '' };
  }
}
