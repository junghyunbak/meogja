import axios from 'axios';
import { useQuery } from 'react-query';
import { Header } from './_components/Header';
import { useContext } from 'react';
import { IdentifierContext, ImmutableRoomInfoContext } from '..';
import { Timer } from './_components/Timer';
import { Map } from './_components/Map';
import { Nav } from './_components/Nav';

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

  const userName = data.user[userId];

  if (endTime < Date.now()) {
    return <div>사용이 종료되었습니다.</div>;
  }

  return (
    <div className="relative flex size-full flex-col">
      <Header userName={userName} />
      <Nav />

      <Map />

      <div className="absolute bottom-3 left-3">
        <Timer />
      </div>
    </div>
  );
}
