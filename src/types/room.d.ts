type UserId = string;
type UserName = string;

type RoomId = string;

type RestaurantId = string;

type RIGHT = 0;
type LEFT = 1;

type Restaurant = {
  /**
   * 식당 식별자
   */
  id: RestaurantId;

  /**
   * 식당 이름
   */
  name: string;

  /**
   * 식당의 위치
   */
  lat: number;
  lng: number;

  /**
   * 카카오 맵의 식당 상세정보 링크
   */
  placeUrl: string;
};

type UserData = {
  /**
   * 사용자 이름
   */
  userName: UserName;

  /**
   * 사용자가 원하는 식당 정보
   */
  select: RestaurantId[];

  /**
   * 사용자가 보고있는 지도의 위치
   */
  lat: number | null;
  lng: number | null;

  /**
   * 사용자가 최근 바라본 방향
   */
  direction: LEFT | RIGHT;
};

type User = Record<UserId, UserData>;

type RoomInfo = {
  /**
   * 모일 장소의 위치
   */
  lat: number;
  lng: number;

  /**
   * 모일 장소의 최대 반경 (단위: 미터)
   */
  radius: number;

  /**
   * 고를 수 있는 최대 식당 개수
   */
  maxPickCount: number;

  /**
   * 방에 접속할 수 있는 최대인원
   */
  capacity: number;

  /**
   * 방이 종료되는 시각
   */
  endTime: number;

  /**
   * 방의 식당 데이터
   */
  restaurants: Restaurant[];

  /**
   * 실시간 사용자의 정보
   */
  user: User;
};

type MutableRoomInfo = Pick<RoomInfo, 'user'>;

type ImmutableRoomInfo = Pick<RoomInfo, 'lat' | 'lng' | 'capacity' | 'endTime' | 'radius' | 'restaurants'>;

type Gage = 0 | 1 | 2 | 3 | 4;
