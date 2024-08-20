import { memo, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';

import RamenNoodle from '@/assets/svgs/ramen-noodle.svg?react';

import './index.css';

interface RestaurantMarkerProps {
  map: naver.maps.Map;
  restaurant: Restaurant;
  count: number;
  isVisible: boolean;
}

export const RestaurantMarker = memo(({ map, restaurant, count, isVisible }: RestaurantMarkerProps) => {
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  /**
   * 마커 상태 초기화
   */
  useEffect(() => {
    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(restaurant.lat, restaurant.lng),
      animation: naver.maps.Animation.DROP,
      icon: {
        content: createMarkerIcon(count),
      },
    });

    setMarker(marker);

    return () => {
      marker.setMap(null);
    };
  }, []);

  /**
   * 마커 이벤트 등록
   */
  useEffect(() => {
    if (!marker) {
      return;
    }

    const handleMarkerClick = () => {
      const { lat, lng } = restaurant;

      map.setCenter(new naver.maps.LatLng(lat, lng));
    };

    const clicklistener = naver.maps.Event.addListener(marker, 'click', handleMarkerClick);

    return () => {
      naver.maps.Event.removeListener(clicklistener);
    };
  }, [marker]);

  /**
   * 선택 횟수에 따른 마커 상태변경
   */
  useEffect(() => {
    if (!marker) {
      return;
    }

    marker.setIcon({ content: createMarkerIcon(count) });
  }, [marker, count]);

  /**
   * 먹은 식당 요소 보기 체크 여부에 따른 상태변경
   */
  useEffect(() => {
    if (!marker) {
      return;
    }

    marker.setVisible(isVisible);
  }, [marker, isVisible]);

  return null;
});

/**
 * 동적 tailwind 스타일을 사용하기 위한 기록
 */
[
  '[&>g>path:nth-last-child(-n+1)]:fill-transparent',
  '[&>g>path:nth-last-child(-n+2)]:fill-transparent',
  '[&>g>path:nth-last-child(-n+3)]:fill-transparent',
  '[&>g>path:nth-last-child(-n+4)]:fill-transparent',
  '[&>g>path:nth-last-child(-n+5)]:fill-transparent',
  '[&>g>path:nth-last-child(-n+6)]:fill-transparent',
  '[&>g>path:nth-last-child(-n+7)]:fill-transparent',
];

function createMarkerIcon(count = 0) {
  return renderToString(
    <div className="restaurant-marker relative">
      <RamenNoodle
        className={`w-full text-ramen [&>g>path:nth-last-child(-n+${Math.min(count, 7)})]:fill-transparent`}
      />

      {count > 0 && (
        <div className="absolute -right-[15%] -top-1/4 flex aspect-square w-6 items-center justify-center rounded-full bg-black/45">
          <p className="text-xs text-white">{count}</p>
        </div>
      )}
    </div>
  );
}
