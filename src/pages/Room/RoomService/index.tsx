import axios from 'axios';
import { useQuery } from 'react-query';
import { Header } from './_components/Header';

interface RoomServiceProps {
  roomId: string;
  userId: string;
}

export function RoomService({ roomId, userId }: RoomServiceProps) {
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
    refetchInterval: 10000,
  });

  if (!data) {
    return null;
  }

  const userName = data.user[userId];

  return (
    <div>
      <Header userName={userName} userId={userId} roomId={roomId} />
    </div>
  );
}
