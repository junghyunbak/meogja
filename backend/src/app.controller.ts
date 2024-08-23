import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Patch,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { HttpStatus } from '@nestjs/common';
import { RESPONSE_CODE } from './constants/api';
import { JoinRoomDto } from './dto/join-room.dto';
import { CheckRoomDto } from './dto/check-room.dto';
import { CheckUserDto } from './dto/check-user.dto';
import { GetImmutableRoomStateDto } from './dto/get-immutable-room-state.dto';
import { GetMutableRoomStateDto } from './dto/get-mutable-room-state.dto';
import { UpdateUserLatLngDto } from './dto/update-user-lat-lng.dto';
import { UpdateUserSelectDto } from './dto/update-user-select.dto';
import { UpdateUserGpsLatLngDto } from './dto/update-user-gps-lat-lng.dto';

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

  @Get('check-room')
  @HttpCode(HttpStatus.OK)
  async checkRoomId(
    @Query() query: CheckRoomDto,
  ): Promise<ResponseTemplate<object>> {
    await this.appService.checkRoomIsExist(query.roomId);

    return {
      data: {},
      code: RESPONSE_CODE.OK,
      message: '방 아이디 유효성 검사가 통과하였습니다.',
    };
  }

  @Post('join-room')
  @HttpCode(HttpStatus.CREATED)
  async joinRoom(
    @Body() body: JoinRoomDto,
  ): Promise<ResponseTemplate<{ userId: UserId }>> {
    await this.appService.checkRoomIsExist(body.roomId);

    const userId = await this.appService.joinRoom(body.roomId);

    return {
      data: { userId },
      code: RESPONSE_CODE.OK,
      message: '방에 성공적으로 입장하였습니다.',
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

  @Get('immutable-room-state')
  @HttpCode(HttpStatus.OK)
  async getImmutableRoomState(
    @Query() query: GetImmutableRoomStateDto,
  ): Promise<ResponseTemplate<ImmutableRoomInfo>> {
    const { roomId } = query;

    await this.appService.checkRoomIsExist(roomId);

    const data = await this.appService.getImmutableRoomState(roomId);

    return {
      data,
      message: '성공적으로 데이터를 로드했습니다.',
      code: RESPONSE_CODE.OK,
    };
  }

  @Get('mutable-room-state')
  @HttpCode(HttpStatus.OK)
  async getMutableRoomState(
    @Query() query: GetMutableRoomStateDto,
  ): Promise<ResponseTemplate<MutableRoomInfo>> {
    const data = await this.appService.getMutableRoomState(query.roomId);

    return {
      data,
      message: '성공적으로 데이터를 로드했습니다.',
      code: RESPONSE_CODE.OK,
    };
  }

  @Patch('update-user-lat-lng')
  @HttpCode(HttpStatus.OK)
  async updateUserLatLng(
    @Body() body: UpdateUserLatLngDto,
  ): Promise<ResponseTemplate<object>> {
    await this.appService.updateUserLatLng(
      body.roomId,
      body.userId,
      body.lat,
      body.lng,
      body.direction,
    );

    return {
      data: {},
      message: '성공적으로 사용자 위치정보를 업데이트 했습니다.',
      code: RESPONSE_CODE.OK,
    };
  }

  @Patch('update-user-gps-lat-lng')
  @HttpCode(HttpStatus.OK)
  async updateUserGpsLatLng(
    @Body() body: UpdateUserGpsLatLngDto,
  ): Promise<ResponseTemplate<object>> {
    await this.appService.updateUserGpsLatLng(
      body.roomId,
      body.userId,
      body.lat,
      body.lng,
    );

    return {
      data: {},
      message: '성공적으로 사용자 위치정보를 업데이트 했습니다.',
      code: RESPONSE_CODE.OK,
    };
  }

  @Patch('update-user-select')
  @HttpCode(HttpStatus.OK)
  async updateUserSelect(
    @Body() body: UpdateUserSelectDto,
  ): Promise<ResponseTemplate<object>> {
    await this.appService.updateUserSelect(
      body.roomId,
      body.userId,
      body.restaurantId,
    );

    return {
      data: {},
      message: '성공적으로 사용자 선택정보를 업데이트 했습니다.',
      code: RESPONSE_CODE.OK,
    };
  }
}
