import { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import Chicken from '@/assets/svgs/chicken.svg?react';
import Marker from '@/assets/svgs/marker.svg?react';
import MarkerShadow from '@/assets/svgs/marker-shadow.svg?react';
import useStore from '@/store';

interface RestaurantMarkerProps {
  restaurant: Restaurant;
}

export const RestaurantMarker = ({ restaurant }: RestaurantMarkerProps) => {
  const [map] = useStore((state) => [state.map]);
  const [mySelect] = useStore((state) => [state.mySelect]);
  const [currentRestaurantId, setCurrentRestaurantId] = useStore((state) => [
    state.currentRestaurantId,
    state.setCurrentRestaurantId,
  ]);

  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(restaurant.lat, restaurant.lng),
      animation: naver.maps.Animation.DROP,
      icon: {
        content: createMarkerIcon(false, false),
      },
    });

    setMarker(marker);

    const listener = naver.maps.Event.addListener(marker, 'click', () => {
      const { id, lat, lng } = restaurant;

      map.setCenter(new naver.maps.LatLng(lat, lng));

      setCurrentRestaurantId(id);
    });

    return () => {
      marker.setMap(null);

      naver.maps.Event.removeListener(listener);
    };
  }, [map, setCurrentRestaurantId, restaurant]);

  /**
   * restaurantId가 변경될 때 마다 마커 아이콘을 변경
   */
  useEffect(() => {
    if (!marker) {
      return;
    }

    const isActive = currentRestaurantId === restaurant.id;

    const isSelect = mySelect.includes(restaurant.id);

    marker.setIcon({ content: createMarkerIcon(isActive, isSelect) });
  }, [currentRestaurantId, restaurant, mySelect, marker]);

  return null;
};

function createMarkerIcon(isActive: boolean, isSelect: boolean) {
  return renderToString(
    <div
      className={`relative aspect-[1/1.22] -translate-x-[50%] -translate-y-full transition-all ${isActive ? 'z-50 w-14' : 'w-12'}`}
    >
      <MarkerShadow
        className={`absolute bottom-0 left-[50%] ${isActive ? 'w-16' : 'w-12'}`}
      />
      <Marker
        className={`absolute left-0 top-0 text-bg-secondary ${isSelect ? 'text-primary' : isActive ? 'text-bg' : ''} ${isActive ? 'stroke-white' : ''}`}
      />
      <div
        className={`absolute left-0 top-0 flex items-center justify-center ${isActive ? 'p-3' : 'p-2.5'}`}
      >
        <Chicken className="w-full text-white" />
      </div>
    </div>
  );
}
