import { useContext } from 'react';
import { useQuery } from 'react-query';

import useStore from '@/store';

import axios from 'axios';

import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { useMutationTimeContext } from '@/pages/Room/_components/MutationTimeProvider/index.context';

export function RefetchIntervalMutableRoomState() {
  const userId = useContext(UserIdContext);
  const roomId = useContext(RoomIdContext);

  const mutationTime = useMutationTimeContext();

  const [setMySelect] = useStore((state) => [state.setMySelect]);
  const [setMyName] = useStore((state) => [state.setMyName]);
  const [setUser] = useStore((state) => [state.setUser]);
  const [setMyMapLatLng] = useStore((state) => [state.setMyMapLatLng]);

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

      const { select, userName, lat, lng } = user[userId];

      setMyName(userName);
      setMySelect(select);

      if (lat && lng) {
        setMyMapLatLng(lat, lng);
      }
    },
    refetchInterval: 500,
  });

  return null;
}
