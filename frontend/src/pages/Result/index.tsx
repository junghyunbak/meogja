import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { plugins, Preprocessing } from '@/components/Preprocessing';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';
import { MutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';

import Check from '@/assets/svgs/check.svg?react';
import RamenNoddleNonShadow from '@/assets/svgs/ramen-noodle-non-shadow.svg?react';

import * as geolib from 'geolib';

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
  const { restaurants } = useContext(ImmutableRoomInfoContext);
  const { user } = useContext(MutableRoomInfoContext);
  const navigate = useNavigate();

  const [isCopy, setIsCopy] = useState(false);

  /**
   * 등수 계산
   */
  const restaurantIdToPoint = new Map<RestaurantId, { count: number; distance: number }>();

  Object.keys(user).forEach((userId) => {
    user[userId].select.forEach((restaurantId) => {
      const restaurant = restaurants.find(({ id }) => restaurantId === id);

      if (!restaurant) {
        return;
      }

      if (!restaurantIdToPoint.has(restaurantId)) {
        restaurantIdToPoint.set(restaurantId, { count: 0, distance: 0 });
      }

      const point = restaurantIdToPoint.get(restaurantId);

      if (!point) {
        return;
      }

      point.count += 1;

      point.distance += geolib.getDistance(
        { lat: restaurant.lat, lng: restaurant.lng },
        { lat: user[userId].gpsLat || restaurant.lat, lng: user[userId].gpsLng || restaurant.lng }
      );
    });
  });

  const handleShareButtonClick = () => {
    if (isCopy) {
      return;
    }

    const text = [
      ...[...restaurantIdToPoint.entries()]
        .sort((a, b) => {
          if (a[1].count > b[1].count) {
            return -1;
          } else if (a[1].count < b[1].count) {
            return 1;
          } else {
            return a[1].distance < b[1].distance ? -1 : 1;
          }
        })
        .map(([restaurantId], i) => {
          const restaurant = restaurants.find(({ id }) => id === restaurantId);

          if (!restaurant) {
            return '';
          }

          return `${i + 1}위 ${restaurant.name} ${restaurant.placeUrl}`;
        }),
    ].join('\n\n');

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
          {[...restaurantIdToPoint.entries()]
            .sort((a, b) => {
              if (a[1].count > b[1].count) {
                return -1;
              } else if (a[1].count < b[1].count) {
                return 1;
              } else {
                return a[1].distance < b[1].distance ? -1 : 1;
              }
            })
            .map(([restaurantId, { count }], i) => {
              const restaurant = restaurants.find(({ id }) => id === restaurantId);

              if (!restaurant) {
                return null;
              }

              return (
                <li className="flex justify-between" key={restaurantId}>
                  <div className="flex flex-1 items-center gap-2 overflow-hidden">
                    <p className="text-lg">{i + 1}</p>

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

      <p className="text-xs">* 동수 득표의 경우, 모두에게서 가까운 순으로 순위를 매김</p>

      <div className="flex gap-3">
        <div className="cursor-pointer bg-black p-3" onClick={handleShareButtonClick}>
          {!isCopy ? (
            <p className="text-white">결과 공유하기</p>
          ) : (
            <div className="flex cursor-default items-center gap-2">
              <Check className="h-3 text-white" />
              <p className="text-white">복사완료</p>
            </div>
          )}
        </div>

        <div
          className="cursor-pointer border-2 border-black p-3"
          onClick={() => {
            navigate('/');
          }}
        >
          <p>홈으로</p>
        </div>
      </div>
    </div>
  );
}

export default Result;
