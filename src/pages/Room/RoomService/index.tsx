import axios from 'axios';
import { useQuery } from 'react-query';
import { Header } from './_components/Header';
import { useContext } from 'react';
import { IdentifierContext } from '..';
import { Timer } from './_components/Timer';

export function RoomService() {
  const { userId, roomId } = useContext(IdentifierContext);

  const { data } = useQuery({
    queryKey: ['room-service', roomId],
    queryFn: async () => {
      const {
        data: { data },
      } = await axios.get<ResponseTemplate<RoomInfo>>('/api/state', {
        params: { roomId },
      });

      return data;
    },
    refetchInterval: 1000,
  });

  if (!data) {
    return null;
  }

  const userName = data.user[userId];
  const endTime = data.endTime;

  if (endTime < Date.now()) {
    return <div>사용이 종료되었습니다.</div>;
  }

  return (
    <div className="relative size-full">
      <Header userName={userName} />

      <div className="absolute bottom-3 left-3">
        <Timer endTime={endTime} />
      </div>
    </div>
  );
}
