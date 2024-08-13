import { IsString } from 'class-validator';

export class GetMutableRoomStateDto {
  @IsString()
  roomId: RoomId;
}
