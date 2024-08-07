import { useEffect, useRef, useContext } from 'react';
import { useQuery } from 'react-query';

import useStore from '@/store';

import axios from 'axios';

import { UserIdContext } from '@/pages/Room/_components/CheckUserId/index.context';
import { RoomIdContext } from '@/pages/Room/_components/CheckRoomId/index.context';

export function RefetchIntervalMutableRoomState() {
  const userId = useContext(UserIdContext);
  const roomId = useContext(RoomIdContext);

  const isUpdatingRef = useRef<boolean>(false);

  const [setMySelect] = useStore((state) => [state.setMySelect]);
  const [setMyName] = useStore((state) => [state.setMyName]);
  const [setUser] = useStore((state) => [state.setUser]);
  const [setIsUpdatingRef] = useStore((state) => [state.setIsUpdatingRef]);

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
      const { select, userName } = user[userId];

      setMyName(userName);
      setMySelect(select);
      setUser(user);
    },
    refetchInterval: 1000,
  });

  return null;
}
