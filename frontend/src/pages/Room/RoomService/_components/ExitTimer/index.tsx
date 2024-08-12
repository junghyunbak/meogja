import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';

export function ExitTimer() {
  const navigate = useNavigate();

  const roomId = useContext(RoomIdContext);
  const { endTime } = useContext(ImmutableRoomInfoContext);

  const [remainSecond, setRemainSecond] = useState(Math.floor((endTime - Date.now()) / 1000));

  /**
   * 타이머 작동
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainSecond((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [endTime]);

  /**
   * 남은 시간이 0초 이하일 경우 결과 페이지로 라우트
   */
  useEffect(() => {
    if (remainSecond <= 0) {
      navigate(`/result/${roomId}`);
    }
  }, [remainSecond, navigate, roomId]);

  const s = remainSecond;

  const m = Math.floor(remainSecond / 60);

  const h = Math.floor(m / 60);

  return (
    <div className="w-fit bg-black px-4 py-3">
      <p className="text-white">
        집에 돌아갈 시간{' '}
        {`${(h % 24).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`}
      </p>
    </div>
  );
}
