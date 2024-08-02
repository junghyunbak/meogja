import Logo from '@/assets/svgs/Logo.svg?react';
import { AutoPlayFD } from '@/components/molecule/AutoPlayFD';

export function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-between bg-bg">
      <AutoPlayFD />

      <div className="flex flex-col items-center gap-8">
        <Logo className="text-white" />
        <p className="text-white">
          함께하고 싶은 <span className="font-bold text-primary">식당</span>을
          다같이 골라보세요.
        </p>
        <div className="flex w-full items-center justify-center rounded bg-primary py-2 text-white">
          시작하기
        </div>
      </div>

      <AutoPlayFD reverse />
    </div>
  );
}
