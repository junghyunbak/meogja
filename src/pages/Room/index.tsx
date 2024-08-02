import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';

export function Room() {
  const { roomId } = useParams();

  const { isLoading, isError, error } = useQuery({
    queryKey: [],
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
    },
  });

  if (isError) {
    return <div>{error instanceof AxiosError && error.message}</div>;
  }

  if (isLoading) {
    return <div>로딩중</div>;
  }

  return <div>{roomId}</div>;
}
