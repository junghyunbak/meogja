import Logo from '@/assets/svgs/Logo.svg?react';
import { AutoPlayFD } from '@/components/molecule/AutoPlayFD';
import { useNavigate } from 'react-router-dom';

export function Home() {
  /**
   * navigate: 실제론 없을 기능
   */
  const navigate = useNavigate();

  const handleStartButtonClick = () => {
    navigate('/room/0');
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between bg-bg">
      <AutoPlayFD />

      <div className="flex flex-col items-center gap-8">
        <Logo className="text-white" />
        <p className="text-white">
          함께하고 싶은 <span className="font-bold text-primary">식당</span>을
          다같이 골라보세요.
        </p>
        <div
          onClick={handleStartButtonClick}
          className="flex w-full cursor-pointer items-center justify-center rounded bg-primary py-2 text-white"
        >
          시작하기
        </div>

        <p className="text-xs text-gray-400">
          또는 아래로 스크롤하여 사용법 읽기
        </p>
      </div>

      <AutoPlayFD reverse />
    </div>
  );
}
