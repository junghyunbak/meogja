import { useContext, useState } from 'react';

import { plugins, Preprocessing } from '@/components/Preprocessing';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';
import { MutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';

import Check from '@/assets/svgs/check.svg?react';
import RamenNoddleNonShadow from '@/assets/svgs/ramen-noodle-non-shadow.svg?react';

function Result() {
  return (
    <Preprocessing
      plugins={[
        plugins.CheckRoomId,
        plugins.CheckRoomId.LoadImmutableRoomData,
        plugins.CheckRoomId.LoadMutableRoomData,
      ]}
      loadingMessage="결과 가져오는 중"
    >
      <ResultService />
    </Preprocessing>
  );
}

function ResultService() {
  const { restaurants, endTime } = useContext(ImmutableRoomInfoContext);
  const { user } = useContext(MutableRoomInfoContext);

  const [isCopy, setIsCopy] = useState(false);

  /**
   * 등수 계산
   */
  const restaurantIdToCount = new Map<RestaurantId, number>();

  Object.keys(user).forEach((userId) => {
    user[userId].select.forEach((restaurantId) => {
      restaurantIdToCount.set(restaurantId, (restaurantIdToCount.get(restaurantId) || 0) + 1);
    });
  });

  const candidate: { restaurantId: RestaurantId; rank: number; count: number }[] = [];

  [...restaurantIdToCount.entries()]
    .map((v) => ({ restaurantId: v[0], count: v[1] }))
    .sort((a, b) => (a.count > b.count ? -1 : 1))
    .forEach((a, i, arr) => {
      const j = arr.findIndex((b) => a.count === b.count);

      candidate.push({ restaurantId: a.restaurantId, rank: i === j ? i + 1 : j + 1, count: a.count });
    });

  const handleShareButtonClick = () => {
    if (isCopy) {
      return;
    }

    const text = [
      ...candidate.map(({ restaurantId, rank }) => {
        const restaurant = restaurants.find(({ id }) => id === restaurantId);

        if (!restaurant) {
          return '';
        }

        return `${rank}위 ${restaurant.name} ${restaurant.placeUrl}`;
      }),
    ].join('\n');

    if (window.navigator.share) {
      window.navigator.share({ text });
    } else {
      window.navigator.clipboard.writeText(text);

      setIsCopy(true);

      setTimeout(() => {
        setIsCopy(false);
      }, 2000);
    }
  };

  if (endTime > Date.now()) {
    return <div>아직 종료되지 않았습니다.</div>;
  }

  return (
    <div className="flex size-full flex-col items-center justify-center gap-8 p-6">
      <div className="relative left-0 top-0 flex w-full flex-col border-2 border-black">
        <div className="absolute left-[3px] top-[3px] -z-10 box-content h-full w-full border-2 border-black bg-white" />
        <div className="absolute left-[8px] top-[8px] -z-20 box-content h-full w-full border-2 border-black bg-white" />

        <div className="flex items-center justify-start bg-white p-3">
          <p className="text-lg">비둘기들의 선택은?</p>
        </div>

        <div className="w-full border-b-2 border-black" />

        <ul className="flex flex-col gap-3 bg-white p-3">
          {candidate.map(({ restaurantId, rank, count }) => {
            const restaurant = restaurants.find(({ id }) => id === restaurantId);

            if (!restaurant) {
              return;
            }

            return (
              <li className="flex justify-between" key={restaurantId}>
                <div className="flex flex-1 items-center gap-2 overflow-hidden">
                  <p className="text-lg">{rank}</p>

                  <RamenNoddleNonShadow className="w-7 shrink-0" />

                  <a className="truncate text-lg" href={restaurant.placeUrl} target="_blank">
                    {restaurant.name}
                  </a>
                </div>

                <p className="text-nowrap text-lg">{count}표</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="cursor-pointer border-2 border-black p-3" onClick={handleShareButtonClick}>
        {!isCopy ? (
          <p>결과 공유하기</p>
        ) : (
          <div className="flex cursor-default items-center gap-2">
            <Check className="h-3" />
            <p>클립보드에 복사되었습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Result;
