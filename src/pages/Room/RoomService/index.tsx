import axios from 'axios';
import { useQuery } from 'react-query';
import { Header } from './_components/Header';
import { useContext } from 'react';
import { IdentifierContext, ImmutableRoomInfoContext } from '..';
import { Timer } from './_components/Timer';
import { Map } from './_components/Map';
import { Nav } from './_components/Nav';
import { RestaurantCards } from './_components/RestaurantCards';

export function RoomService() {
  const { userId, roomId } = useContext(IdentifierContext);

  const { endTime } = useContext(ImmutableRoomInfoContext);

  const { data } = useQuery({
    queryKey: ['room-service', roomId],
    queryFn: async () => {
      const {
        data: { data },
      } = await axios.get<ResponseTemplate<RoomInfo>>(
        '/api/mutable-room-state',
        {
          params: { roomId },
        }
      );

      return data;
    },
    refetchInterval: 1000,
  });

  if (!data) {
    return null;
  }

  const { userName, select } = data.user[userId];

  // [ ]: 개발 중 불편하여 주석처리
  /*
  if (endTime < Date.now()) {
    return <div>사용이 종료되었습니다.</div>;
  }
    */

  return (
    <div className="relative flex size-full flex-col justify-between">
      <div className="bg-red absolute inset-0">
        <Map />
      </div>

      <div className="absolute top-0 flex w-full flex-col">
        <Header userName={userName} />
        <Nav />
      </div>

      <div className="absolute bottom-0 z-[9999] flex w-full flex-col">
        <div className="p-3">
          <Timer />
        </div>
        <RestaurantCards select={select} />
      </div>
    </div>
  );
}
