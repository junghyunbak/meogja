import { IsIn, IsNumber } from 'class-validator';

const categories: Category[] = ['FD', 'CE'];

export class CreateRoomDto implements Omit<ImmutableRoomInfo, 'restaurants'> {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsNumber()
  radius: number;

  @IsNumber()
  capacity: number;

  @IsNumber()
  maxPickCount: number;

  @IsIn(categories)
  category: Category;

  @IsNumber()
  endTime: number;
}
