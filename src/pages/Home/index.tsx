import { useNavigate } from 'react-router-dom';

import StrokeDove from '@/assets/svgs/stroke-dove.svg?react';

export function Home() {
  /**
   * navigate: 실제론 없을 기능
   */
  const navigate = useNavigate();

  const handleStartButtonClick = () => {
    navigate('/room/0');
  };

  return (
    <div className="relative flex size-full items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <StrokeDove className="w-2/3" />

        <div className="flex items-center gap-2 [&>p]:text-base">
          <p>비둘기야 같이</p>
          <div className="flex w-6 justify-center text-[#CDB8B8]">밥</div>
          <p>먹자</p>
        </div>
        <div
          onClick={handleStartButtonClick}
          className="flex w-fit cursor-pointer items-center justify-center border border-black p-3"
        >
          <p className="text-sm">활동 영역 정하기</p>
        </div>
      </div>

      <div className="absolute bottom-9">
        <p className="text-xs">죽어서도 행복할 비둘기처럼</p>
      </div>
    </div>
  );
}
