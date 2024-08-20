import { useContext } from 'react';
import { useQuery } from 'react-query';

import { useStore } from 'zustand';

import axios from 'axios';

import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { useMutationTimeContext } from '@/pages/Room/_components/MutationTimeProvider/index.context';
import { MutableRoomInfoStoreContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';

export function RefetchIntervalMutableRoomState() {
  const roomId = useContext(RoomIdContext);

  const [setUser] = useStore(useContext(MutableRoomInfoStoreContext), (s) => [s.setUser]);

  const mutationTime = useMutationTimeContext();

  useQuery({
    queryKey: ['room-service'],
    queryFn: async () => {
      const sendTime = Date.now();

      const {
        data: { data },
      } = await axios.get<ResponseTemplate<MutableRoomInfo>>('/api/mutable-room-state', {
        params: { roomId },
      });

      return { sendTime, data };
    },
    onSuccess({ sendTime, data }) {
      if (mutationTime.current > sendTime) {
        return;
      }

      setUser(data.user);
    },
    refetchInterval: 500,
  });

  return null;
}
