import useStore from '@/store';

import './index.css';

const MAX_GAGE: Gage = 4;

export function LoadingPage() {
  const [gage] = useStore((state) => [state.gage]);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <p className="text-2xl">
        로딩중
        {Array(gage)
          .fill(null)
          .map(() => '.')}
      </p>
      <div className="loading-bar">
        <div style={{ width: `${Math.floor((gage / MAX_GAGE) * 100)}%` }} />
      </div>
    </div>
  );
}
