import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-room')
  createRoom(@Body() body: CreateRoomDto): string {
    console.log(body);

    return this.appService.getHello();
  }
}
