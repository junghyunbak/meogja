import { useEffect, useState, useContext } from 'react';
import { ImmutableRoomInfoContext } from '@/pages/Room';

export function ExitTimer() {
  const { endTime } = useContext(ImmutableRoomInfoContext);

  const [remainSecond, setRemainSecond] = useState(
    Math.floor((endTime - Date.now()) / 1000)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainSecond((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [endTime]);

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
