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
      icon: {
        content: renderToString(
          <div className="relative aspect-[1/1.22] w-12">
            <MarkerShadow className="absolute bottom-[-3px] left-[7px]" />
            <Marker className="absolute left-0 top-0 text-bg-secondary" />
            <div className="absolute left-0 top-0 flex items-center justify-center p-2.5">
              <Chicken className="w-full" />
            </div>
          </div>
        ),
      },
    });

    const listener = naver.maps.Event.addListener(marker, 'click', () => {
      setRestaurantId(restaurant.id);
    });

    return () => {
      marker.setMap(null);

      naver.maps.Event.removeListener(listener);
    };
  }, [map, restaurant]);

  return <div>{/* MapMarker 함수 컴포넌트 */}</div>;
}
