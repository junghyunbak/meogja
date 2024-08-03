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

  useEffect(() => {
    const { lat, lng } = restaurant;

    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(lat, lng),
      animation: naver.maps.Animation.DROP,
      icon: {
        content: renderToString(
          <div className="relative aspect-[1/1.22] w-12 -translate-x-[50%] -translate-y-full">
            <MarkerShadow className="absolute bottom-[-10px] left-[30%] w-12" />
            <Marker className="absolute left-0 top-0 text-bg-secondary" />
            <div className="absolute left-0 top-0 flex items-center justify-center p-2.5">
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
  }, [map, restaurant, setRestaurantId]);

  return <div>{/* MapMarker 함수 컴포넌트 */}</div>;
}
