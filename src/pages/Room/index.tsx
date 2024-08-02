import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { RoomService } from './RoomService';
import { createContext } from 'react';

type IdentifierContextValue = {
  userId: string;
  roomId: string;
};

export const IdentifierContext = createContext<IdentifierContextValue>(
  {} as IdentifierContextValue
);

export function Room() {
  const { roomId } = useParams();

  const {
    data: userId,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['join-room'],
    queryFn: async () => {
      if (!roomId) {
        return;
      }

      /**
       * 1. 해당 브라우저의 이전 접속여부 확인
       */
      let userId = localStorage.getItem(roomId);

      /**
       * 2-1. 첫 접속일 경우 방 입장 수행
       */
      if (!userId) {
        const {
          data: {
            data: { id },
          },
        } = await axios.post<ResponseTemplate<{ id: string }>>('/api/join', {
          roomId,
        });

        userId = id;
      } else {
        /**
         * 2-2. 첫 접속이 아니라면 식별자 유효성 검사
         */
        await axios.get('/api/chk-user-id', { params: { userId, roomId } });
      }

      /**
       * 3. 접속에 성공했을경우 식별자를 초기화
       */
      localStorage.setItem(roomId, userId);

      return userId;
    },
    onError(err) {
      if (!roomId || !(err instanceof AxiosError)) {
        return;
      }

      /**
       * 잘못된 접근으로 인한 에러 시, 해당 방의 사용자 식별자 제거
       */
      if (err.response?.status === 401) {
        localStorage.removeItem(roomId);
      }
    },
  });

  if (!roomId || !userId) {
    return null;
  }

  if (isError) {
    if (error instanceof AxiosError && error.response?.status === 403) {
      return <div>접속 가능한 방 최대인원을 초과하였습니다.</div>;
    }

    if (error instanceof AxiosError && error.response?.status === 401) {
      return <div>잘못된 접근입니다.</div>;
    }
  }

  if (isLoading) {
    return <div>로딩중입니다.</div>;
  }

  return (
    <IdentifierContext.Provider value={{ roomId, userId }}>
      <RoomService />
    </IdentifierContext.Provider>
  );
}
