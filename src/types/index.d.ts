type UserId = string;
type UserName = string;

type RestaurantId = string;

type RIGHT = 0;
type LEFT = 1;

type Restaurant = {
  id: RestaurantId;
  name: string;
  lat: number;
  lng: number;
  placeUrl: string;
};

type Chat = {
  id: string;
  date: number;
  type: 'notice' | 'message';
  content: string;
  userId?: UserId; // type이 message인 경우에만 포함
};

type UserData = {
  userName: UserName;
  select: RestaurantId[];
  picky: RestaurantId[];
  // [ ]: 사용자의 카메라 위치인지, gps위치인지를 구분해야한다.
  lat: number | null;
  lng: number | null;
  direction: LEFT | RIGHT;
};

// [ ]: `User` 이름 바꿔야할듯
type User = Record<UserId, UserData>;

type RoomInfo = {
  lat: number;
  lng: number;
  capacity: number;
  endTime: number;
  radius: number; // 미터(m)
  restaurants: Restaurant[];
  chats: Chat[];
  user: User;
};

type MutableRoomInfo = Pick<RoomInfo, 'chats' | 'user'>;

type ImmutableRoomInfo = Pick<RoomInfo, 'lat' | 'lng' | 'capacity' | 'endTime' | 'radius' | 'restaurants'>;

type ResponseTemplate<T> = {
  data: T;
};
