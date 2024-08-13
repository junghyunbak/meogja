import { IsString } from 'class-validator';

export class CheckUserDto {
  @IsString()
  roomId: RoomId;

  @IsString()
  userId: UserId;
}
