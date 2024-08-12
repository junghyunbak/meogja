import { useContext } from 'react';
import { useQuery } from 'react-query';

import { UserIdContextProvider } from './index.context';

import axios from 'axios';

import { RoomIdContext } from '../CheckRoomId/index.context';

import { type Plugin } from '../..';

export const CheckUserId: Plugin = ({ children, step, setStep, time }) => {
  const roomId = useContext(RoomIdContext);

  const { data, isLoading } = useQuery({
    queryKey: ['check-user-id', time],
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
      setStep(step);
    },
    suspense: true,
    useErrorBoundary: true,
  });

  if (isLoading || !data) {
    return null;
  }

  return <UserIdContextProvider value={data}>{children}</UserIdContextProvider>;
};
