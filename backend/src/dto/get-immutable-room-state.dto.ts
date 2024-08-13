import { IsString } from 'class-validator';

export class GetImmutableRoomStateDto {
  @IsString()
  roomId: RoomId;
}
