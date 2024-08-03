import { useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import Chicken from '@/assets/svgs/chicken.svg?react';
import Marker from '@/assets/svgs/marker.svg?react';
import MarkerShadow from '@/assets/svgs/marker-shadow.svg?react';
import useStore from '@/store';

interface MapMarkerProps {
  map: naver.maps.Map;
  restaurant: Restaurant;
}

export function MapMarker({ map, restaurant }: MapMarkerProps) {
  const [setRestaurantId] = useStore((state) => [state.setRestaurantId]);

  const [restaurantId] = useStore((state) => [state.restaurantId]);

  useEffect(() => {
    const { id, lat, lng } = restaurant;

    const isActive = restaurantId === id;

    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(lat, lng),
      icon: {
        content: renderToString(
          <div
            className={`relative aspect-[1/1.22] -translate-x-[50%] -translate-y-full transition-all ${isActive ? 'z-50 w-14' : 'w-12'}`}
          >
            <MarkerShadow className="w-13 absolute bottom-[-10px] left-[30%]" />
            <Marker
              className={`absolute left-0 top-0 text-bg-secondary ${isActive ? 'stroke-white text-bg' : ''}`}
            />
            <div
              className={`absolute left-0 top-0 flex items-center justify-center ${isActive ? 'p-3' : 'p-2.5'}`}
            >
              <Chicken className="w-full" />
            </div>
          </div>
        ),
      },
    });

    const listener = naver.maps.Event.addListener(marker, 'click', () => {
      const { id, lat, lng } = restaurant;

      map.setCenter(new naver.maps.LatLng(lat, lng));

      setRestaurantId(id);
    });

    return () => {
      marker.setMap(null);

      naver.maps.Event.removeListener(listener);
    };
  }, [restaurantId, map, restaurant, setRestaurantId]);

  return <div>{/* MapMarker 함수 컴포넌트 */}</div>;
}
