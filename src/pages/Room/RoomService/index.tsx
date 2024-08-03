import axios from 'axios';
import { useQuery } from 'react-query';
import { Header } from './_components/Header';
import { useContext, useEffect } from 'react';
import { IdentifierContext, ImmutableRoomInfoContext } from '..';
import { Timer } from './_components/Timer';
import { Map } from './_components/Map';
import { Nav } from './_components/Nav';
import { RestaurantCards } from './_components/RestaurantCards';
import { RestaurantMarker } from './_components/RestaurantMarker';
import { MapRadius } from './_components/MapRadius';
import { Geolocation } from './_components/Geolocation';
import useStore from '@/store';

export function RoomService() {
  const { userId, roomId } = useContext(IdentifierContext);

  const { restaurants, endTime } = useContext(ImmutableRoomInfoContext);

  const [setMySelect] = useStore((state) => [state.setMySelect]);

  const { data } = useQuery({
    queryKey: ['room-service', roomId],
    queryFn: async () => {
      const {
        data: { data },
      } = await axios.get<ResponseTemplate<MutableRoomInfo>>(
        '/api/mutable-room-state',
        {
          params: { roomId },
        }
      );

      return data;
    },
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const { select } = data.user[userId];

    setMySelect(select);
  }, [data, userId, setMySelect]);

  if (!data) {
    return null;
  }

  if (endTime < Date.now()) {
    return <div>사용이 종료되었습니다.</div>;
  }

  return (
    <div className="relative flex size-full flex-col justify-between">
      <div className="absolute inset-0">
        <Map />
      </div>

      <div className="absolute top-0 flex w-full flex-col">
        <Header userName={data.user[userId].userName} />
        <Nav />
      </div>

      <div className="absolute bottom-0 z-[9999] flex w-full flex-col">
        <div className="px-[16px] pb-3">
          <Timer />
        </div>

        <RestaurantCards />
        <MapRadius />
        <Geolocation />

        {restaurants.map((restaurant) => {
          return (
            <RestaurantMarker key={restaurant.id} restaurant={restaurant} />
          );
        })}
      </div>
    </div>
  );
}
