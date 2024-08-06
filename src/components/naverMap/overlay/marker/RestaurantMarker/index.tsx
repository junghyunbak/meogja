import { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';

import RamenNoodle from '@/assets/svgs/ramen-noodle.svg?react';
import DoveShit from '@/assets/svgs/dove-shit.svg?react';

import useStore from '@/store';

interface RestaurantMarkerProps {
  map: naver.maps.Map | null;
  restaurant: Restaurant;
}

export const RestaurantMarker = ({ map, restaurant }: RestaurantMarkerProps) => {
  const [mySelect] = useStore((state) => [state.mySelect]);
  const [myPicky] = useStore((state) => [state.myPicky]);

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
      animation: naver.maps.Animation.DROP,
      icon: {
        content: createMarkerIcon(mySelect.includes(restaurant.id), myPicky.includes(restaurant.id)),
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

    marker.setIcon({ content: createMarkerIcon(mySelect.includes(restaurant.id), myPicky.includes(restaurant.id)) });
  }, [mySelect, marker, restaurant, myPicky]);

  return null;
};

function createMarkerIcon(isSelect: boolean, isPicky: boolean) {
  return renderToString(
    <div className="relative -translate-x-[50%] -translate-y-[50%]">
      <div className="absolute left-0 top-0 flex w-14 items-center justify-center">
        <RamenNoodle className={`w-full ${!isSelect ? 'text-[#E7E9C4]' : 'text-transparent'}`} />
      </div>
      <div className="absolute left-0 top-0 flex w-14 items-center justify-center">
        {isPicky && <DoveShit className="w-10" />}
      </div>
    </div>
  );
}
