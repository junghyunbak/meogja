import { IsString } from 'class-validator';

export class CheckRoomDto {
  @IsString()
  roomId: RoomId;
}
