import { useEffect, useRef, useContext } from 'react';
import { useQuery } from 'react-query';

import useStore from '@/store';

import axios from 'axios';

import { IdentifierContext } from '@/pages/Room';

export function RefetchIntervalMutableRoomState() {
  const { userId, roomId } = useContext(IdentifierContext);

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
