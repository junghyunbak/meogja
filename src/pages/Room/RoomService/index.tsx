import axios from 'axios';
import { useQuery } from 'react-query';

interface RoomServiceProps {
  roomId: string;
}

export function RoomService({ roomId }: RoomServiceProps) {
  const { data } = useQuery({
    queryKey: [],
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

  console.log('서버 상태', data);

  return <div>{`방: ${roomId}`}</div>;
}
