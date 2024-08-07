import { useContext } from 'react';
import { useQuery } from 'react-query';

import useStore from '@/store';

import axios from 'axios';

import { UserIdContext } from '@/pages/Room/_components/CheckUserId/index.context';
import { RoomIdContext } from '@/pages/Room/_components/CheckRoomId/index.context';
import { useMutationTimeContext } from '../MutationTimeProvider/index.context';

export function RefetchIntervalMutableRoomState() {
  const userId = useContext(UserIdContext);
  const roomId = useContext(RoomIdContext);

  const mutationTime = useMutationTimeContext();

  const [setMySelect] = useStore((state) => [state.setMySelect]);
  const [setMyName] = useStore((state) => [state.setMyName]);
  const [setUser] = useStore((state) => [state.setUser]);

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
      // [ ]: 모든 업데이트를 막으면 부자연스러워질 수 있다. 다른 사용자들의 요청은 계속 반영되도록 하는 편이 좋겠다.
      if (mutationTime.current > sendTime) {
        return;
      }

      const { user } = data;
      const { select, userName } = user[userId];

      setMyName(userName);
      setMySelect(select);
      setUser(user);
    },
    refetchInterval: 1000,
  });

  return null;
}
