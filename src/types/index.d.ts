type UserId = string;
type UserName = string;

type RestaurantId = string;

type RestaurantKind =
  | "korean"
  | "western"
  | "japan"
  | "snack"
  | "pizza"
  | "chinese"
  | "hamburger"
  | "chicken";

type Restaurant = {
  id: RestaurantId;
  category: RestaurantKind;
  name: string;
  lat: number;
  lng: number;
  placeUrl: string;
};

type Chat = {
  id: string;
  date: number;
  type: "notice" | "message";
  content: string;
  userId?: UserId; // type이 message인 경우에만 포함
};

type Select = Record<UserId, RestaurantId[]>;

type Picky = Record<UserId, RestaurantId>;

type User = Record<UserId, userName>;

type RoomInfo = {
  lat: number;
  lng: number;
  capacity: number;
  endTime: number;
  radius: number; // 미터(m)
  restaurants: Restaurant[];
  chats: Chat[];
  select: Select;
  picky: Picky;
  user: User;
};

type ResponseTemplate<T> = {
  data: T;
};
