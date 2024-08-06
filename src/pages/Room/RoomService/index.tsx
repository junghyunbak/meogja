import axios from 'axios';
import { useQuery } from 'react-query';
import { useContext, useEffect, useRef } from 'react';
import { IdentifierContext, ImmutableRoomInfoContext } from '..';
import { Map } from './_components/Map';
import { Geolocation } from './_components/Geolocation';
import useStore from '@/store';
import { JoinList } from './_components/JoinList';
import { ExitTimer } from './_components/ExitTimer';
import { RestaurantController } from './_components/RestaurantController';

export function RoomService() {
  const { endTime } = useContext(ImmutableRoomInfoContext);

  // [ ]: 실시간으로 종료 여부를 판단할 전역 상태가 필요.
  if (endTime < Date.now()) {
    return <div>사용이 종료되었습니다.</div>;
  }

  return (
    <>
      <div className="relative flex size-full flex-col">
        <div className="absolute top-0 z-20 w-full">
          <JoinList />
          <div className="px-3">
            <ExitTimer />
          </div>
        </div>

        <div className="absolute inset-0 z-10">
          <Map />
        </div>

        <div className="pointer-events-none absolute bottom-0 z-20 w-full">
          <RestaurantController />
        </div>
      </div>

      <Geolocation />

      <RefetchIntervalMutableRoomState />
    </>
  );
}

function RefetchIntervalMutableRoomState() {
  const { userId, roomId } = useContext(IdentifierContext);

  const isUpdatingRef = useRef<boolean>(false);

  const [setMySelect] = useStore((state) => [state.setMySelect]);
  const [setMyName] = useStore((state) => [state.setMyName]);
  const [setUser] = useStore((state) => [state.setUser]);
  const [setIsUpdatingRef] = useStore((state) => [state.setIsUpdatingRef]);
  const [setMyPicky] = useStore((state) => [state.setMyPicky]);

  useEffect(() => {
    setIsUpdatingRef(isUpdatingRef);
  }, [isUpdatingRef, setIsUpdatingRef]);

  useQuery({
    queryKey: ['room-service', roomId],
    queryFn: async () => {
      const {
        data: { data },
      } = await axios.get<ResponseTemplate<MutableRoomInfo>>('/api/mutable-room-state', {
        params: { roomId },
      });

      return data;
    },
    onSuccess(data) {
      if (isUpdatingRef.current) {
        return;
      }

      const { user } = data;
      const { select, userName, picky } = user[userId];

      setMyName(userName);
      setMySelect(select);
      setUser(user);
      setMyPicky(picky);
    },
    refetchInterval: 1000,
  });

  return null;
}
