import axios from 'axios';
import { useQuery } from 'react-query';
import { Header } from './_components/Header';
import { useContext, useEffect } from 'react';
import { IdentifierContext, ImmutableRoomInfoContext } from '..';
import { Map } from './_components/Map';
import { Nav } from './_components/Nav';
import { Geolocation } from './_components/Geolocation';
import useStore from '@/store';
import { BottomSheet } from './_components/BottomSheet';

export function RoomService() {
  const { restaurants, endTime } = useContext(ImmutableRoomInfoContext);

  if (endTime < Date.now()) {
    return <div>사용이 종료되었습니다.</div>;
  }

  return (
    <>
      <div className="relative flex size-full flex-col">
        <Header />
        <Nav />
        <Map>
          <Map.ActivityRadius />
          {restaurants.map((restaurant) => {
            return (
              <Map.RestaurantMarker
                key={restaurant.id}
                restaurant={restaurant}
              />
            );
          })}
        </Map>
      </div>

      <Geolocation />

      <RefetchIntervalMutableRoomState />

      <BottomSheet>
        <BottomSheet.External.Timer />
        <BottomSheet.External.RestaurantPreview />

        <BottomSheet.Content.Rank />
      </BottomSheet>
    </>
  );
}

// [ ]: 두번 리렌더링되는 이슈 존재
function RefetchIntervalMutableRoomState() {
  const { userId, roomId } = useContext(IdentifierContext);

  const [setMySelect] = useStore((state) => [state.setMySelect]);
  const [setMyName] = useStore((state) => [state.setMyName]);
  const [setUser] = useStore((state) => [state.setUser]);

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

    const { user } = data;

    const { select, userName } = user[userId];

    setMySelect(select);
    setMyName(userName);
    setUser(user);
  }, [data, userId, setMySelect, setMyName, setUser]);

  return null;
}
