import { IsString } from 'class-validator';

export class UpdateUserSelectDto {
  @IsString()
  roomId: RoomId;

  @IsString()
  userId: UserId;

  @IsString()
  restaurantId: RestaurantId;
}
