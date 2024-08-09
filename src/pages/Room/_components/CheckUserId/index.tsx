import React, { useContext } from 'react';
import { useQuery } from 'react-query';

import useStore from '@/store';

import { UserIdContextProvider } from './index.context';

import axios from 'axios';
import { RoomIdContext } from '../CheckRoomId/index.context';

interface CheckUserIdProps {
  children: React.ReactNode;
}

export function CheckUserId({ children }: CheckUserIdProps) {
  const [setGage] = useStore((state) => [state.setGage]);

  const roomId = useContext(RoomIdContext);

  const { data, isLoading } = useQuery({
    queryKey: ['check-user-id'],
    queryFn: async () => {
      const userId = localStorage.getItem(roomId);

      /**
       * 사용자 아이디가 존재하지 않는다면 방에 새롭게 입장
       */
      if (!userId) {
        const response = await axios
          .post<ResponseTemplate<{ userId: UserId }>>('/api/join-room', {
            roomId,
          })
          .then((value) => value.data);

        localStorage.setItem(roomId, response.data.userId);

        return response.data.userId;
      }

      /**
       * 사용자 아이디가 존재하면 아이디 유효성 검사를 진행
       */
      await axios.get('/api/check-user-id', { params: { roomId, userId } });

      localStorage.setItem(roomId, userId);

      return userId;
    },
    onSuccess() {
      setGage(3);
    },
    suspense: true,
    useErrorBoundary: true,
  });

  if (isLoading || !data) {
    return null;
  }

  return <UserIdContextProvider value={data}>{children}</UserIdContextProvider>;
}
