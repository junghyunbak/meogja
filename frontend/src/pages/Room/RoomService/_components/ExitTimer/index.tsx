import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';

import Clock from '@/assets/svgs/clock.svg?react';

export function ExitTimer() {
  const navigate = useNavigate();

  const roomId = useContext(RoomIdContext);
  const { endTime, minute } = useContext(ImmutableRoomInfoContext);

  const [remainSecond, setRemainSecond] = useState(Math.floor((endTime - Date.now()) / 1000));

  /**
   * 타이머 작동
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainSecond(Math.floor((endTime - Date.now()) / 1000));
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

  const percent = (remainSecond / (minute * 60)) * 100;

  return (
    <div className="relative flex h-[33dvh] w-3 flex-col items-center rounded-lg border-2 border-black">
      <div className="w-full flex-1 rounded-lg" />
      <div className="w-full rounded-lg bg-p-red" style={{ height: `${percent}%` }} />

      <div className="absolute flex w-6 translate-y-1/2" style={{ bottom: `${percent}%` }}>
        <Clock className="w-full" />

        <div className="absolute right-7">
          <p>{`${(m % 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`}</p>
        </div>
      </div>
    </div>
  );
}
