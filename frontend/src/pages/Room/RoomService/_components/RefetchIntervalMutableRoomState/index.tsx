import { useContext } from 'react';
import { useQuery } from 'react-query';

import useGlobalStore from '@/store';

import axios from 'axios';

import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { useMutationTimeContext } from '@/pages/Room/_components/MutationTimeProvider/index.context';
import { MutableRoomInfoStoreContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';
import { useStore } from 'zustand';

export function RefetchIntervalMutableRoomState() {
  const mutableRoomInfoStore = useContext(MutableRoomInfoStoreContext);

  const [setUser] = useStore(mutableRoomInfoStore, (s) => [s.setUser]);

  const userId = useContext(UserIdContext);
  const roomId = useContext(RoomIdContext);

  const mutationTime = useMutationTimeContext();

  const [setMySelect] = useGlobalStore((state) => [state.setMySelect]);
  const [setMyName] = useGlobalStore((state) => [state.setMyName]);

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
      const { user } = data;

      setUser(user);

      if (mutationTime.current > sendTime) {
        return;
      }

      const { select, userName } = user[userId];

      setMyName(userName);
      setMySelect(select);
    },
    refetchInterval: 500,
  });

  return null;
}
