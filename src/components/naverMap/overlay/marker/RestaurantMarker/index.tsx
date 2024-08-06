import { memo, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';

import RamenNoodle from '@/assets/svgs/ramen-noodle.svg?react';

interface RestaurantMarkerProps {
  map: naver.maps.Map | null;
  restaurant: Restaurant;
  count: number;
}

export const RestaurantMarker = memo(({ map, restaurant, count }: RestaurantMarkerProps) => {
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  /**
   * 마커 상태 초기화
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(restaurant.lat, restaurant.lng),
      // [ ]: 두번 애니메이션이 실행되는 이슈로 비활성화
      //animation: naver.maps.Animation.DROP,
      icon: {
        content: createMarkerIcon(count),
      },
    });

    setMarker(marker);

    return () => {
      marker.setMap(null);
    };
    // `mySelect`는 초기화 용도로 이용
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, restaurant]);

  /**
   * 마커 이벤트 등록
   */
  useEffect(() => {
    if (!map || !marker) {
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
  }, [map, marker, restaurant]);

  /**
   * 마커 상태변경
   */
  useEffect(() => {
    if (!marker) {
      return;
    }

    marker.setIcon({ content: createMarkerIcon(count) });
  }, [count, marker, restaurant]);

  return null;
});

// 동적 tailwind 스타일을 사용하기 위한 기록
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
    <div className="flex w-14 -translate-x-[50%] -translate-y-[100%] items-center justify-center">
      <RamenNoodle className={`w-full text-[#E7E9C4] [&>g>path:nth-last-child(-n+${count})]:fill-transparent`} />
    </div>
  );
}
