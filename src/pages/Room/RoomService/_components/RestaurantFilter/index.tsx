import useStore from '@/store';

import Check from '@/assets/svgs/check.svg?react';

export function RestaurantFilter() {
  const [showOnlyEaten, setShowOnlyEaten] = useStore((state) => [state.showOnlyEaten, state.setShowOnlyEaten]);

  const handleChkBoxClick = () => {
    setShowOnlyEaten(!showOnlyEaten);
  };

  return (
    <div className="pointer-events-auto flex w-fit cursor-pointer items-center gap-3 p-3" onClick={handleChkBoxClick}>
      <div className="flex aspect-square h-4 items-center justify-center border border-black bg-white p-[1px]">
        {showOnlyEaten && <Check className="w-full text-black" />}
      </div>
      <p className="select-none text-base text-black">내가 먹은것만 보기</p>
    </div>
  );
}
