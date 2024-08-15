import { IsNumber, IsString } from 'class-validator';

export class UpdateUserGpsLatLngDto implements Pick<UserData, 'lat' | 'lng'> {
  @IsString()
  roomId: string;

  @IsString()
  userId: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}
