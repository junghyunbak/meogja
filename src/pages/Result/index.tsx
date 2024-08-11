import { useContext, useState } from 'react';

import { plugins, Preprocessing } from '@/components/Preprocessing';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';

import { MutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';

import ColorDove from '@/assets/svgs/color-dove.svg?react';
import Check from '@/assets/svgs/check.svg?react';

function Result() {
  return (
    <Preprocessing
      plugins={[
        plugins.CheckRoomId,
        plugins.CheckRoomId.LoadImmutableRoomData,
        plugins.CheckRoomId.LoadMutableRoomData,
      ]}
      loadingMessage="결과 페이지로 이동 중"
    >
      <ResultService />
    </Preprocessing>
  );
}

function ResultService() {
  const { restaurants, endTime, category } = useContext(ImmutableRoomInfoContext);
  const { user } = useContext(MutableRoomInfoContext);

  const [isCopy, setIsCopy] = useState(false);

  const restaurantIdToCount = new Map<RestaurantId, number>();

  Object.keys(user).forEach((userId) => {
    user[userId].select.forEach((restaurantId) => {
      restaurantIdToCount.set(restaurantId, (restaurantIdToCount.get(restaurantId) || 0) + 1);
    });
  });

  const candidate = Array.from(restaurantIdToCount.entries())
    .sort((a, b) => (a[1] > b[1] ? -1 : 1))
    .map(([restaurantId]) => restaurantId)
    .slice(0, 3);

  // [ ]: 종료되지 않은 방일 경우 보여줄 화면 구현
  if (endTime > Date.now()) {
    return <div>아직 종료되지 않았습니다.</div>;
  }

  return (
    <div className="bg-floor flex min-h-full w-full flex-col items-center gap-8 bg-center p-6">
      <p className="text-2xl">비둘기들의 선택은?</p>

      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center">
          <ColorDove className="w-10 -rotate-90" />
          <p>마시쩡</p>
        </div>

        <div className="w-full border border-black bg-white p-3">
          {candidate.map((restaurantId, i) => {
            const restaurant = restaurants.find(({ id }) => id === restaurantId);

            if (!restaurant) {
              return null;
            }

            return (
              <div>
                <p>{`${i + 1}위 ${restaurant.name}`}</p>
              </div>
            );
          })}
        </div>
      </div>

      {!isCopy ? (
        <div
          className="cursor-pointer bg-black p-3"
          onClick={() => {
            const text = [
              ...candidate.map((restaurantId, i) => {
                const restaurant = restaurants.find(({ id }) => id === restaurantId);

                if (!restaurant) {
                  return '';
                }

                return `${i + 1}위 ${restaurant.name} ${restaurant.placeUrl}`;
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
          }}
        >
          <p className="text-white">
            결과 공유하고{' '}
            <span className={`${category === 'CE' ? 'text-coffee' : 'text-rice'}`}>
              {category === 'FD' ? '식당' : '카페'}
            </span>{' '}
            링크 확인하기
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 bg-black p-3">
          <Check className="h-3 text-white" />
          <p className="text-white">클립보드에 복사되었습니다.</p>
        </div>
      )}
    </div>
  );
}

export default Result;
