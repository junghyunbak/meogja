import { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';

import RamenNoodle from '@/assets/svgs/ramen-noodle.svg?react';

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
        content: createMarkerIcon(),
      },
    });

    setMarker(marker);

    return () => {
      marker.setMap(null);
    };
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

  return null;
};

function createMarkerIcon() {
  return renderToString(
    <div className="-translate-x-[50%] -translate-y-[50%]">
      <RamenNoodle className="w-10" />
    </div>
  );
}
