import { IsIn, IsNumber, IsString } from 'class-validator';
import { LEFT, RIGHT } from 'src/constants/room';

const directions: (LEFT | RIGHT)[] = [LEFT, RIGHT];

export class UpdateUserLatLngDto
  implements Omit<UserData, 'select' | 'userName'>
{
  @IsString()
  roomId: RoomId;

  @IsString()
  userId: UserId;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsIn(directions)
  direction: 0 | 1;
}
