import { useContext, useEffect } from 'react';

import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import axios from 'axios';

import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { useMutationTimeContext } from '@/pages/Room/_components/MutationTimeProvider/index.context';
import { MutableRoomInfoStoreContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';
import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';

export function RefetchIntervalMutableRoomState() {
  const roomId = useContext(RoomIdContext);

  const myId = useContext(UserIdContext);

  const [setUser] = useStore(
    useContext(MutableRoomInfoStoreContext),
    useShallow((s) => [s.setUser])
  );

  const mutationTime = useMutationTimeContext();

  useEffect(() => {
    const timer = setInterval(async () => {
      const sendTime = Date.now();

      try {
        const {
          data: { data },
        } = await axios.get<ResponseTemplate<MutableRoomInfo>>('/api/mutable-room-state', {
          params: { roomId },
        });

        if (mutationTime.current > sendTime) {
          /**
           * 다른 사용자의 정보만 갱신
           */
          setUser((prev) => {
            const next = { ...data.user };

            next[myId] = prev[myId];

            return next;
          });

          return;
        }

        setUser(data.user);
      } catch (e) {
        // do-nothing
      }
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return null;
}
