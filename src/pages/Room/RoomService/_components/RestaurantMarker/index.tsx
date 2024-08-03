import { memo, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import Chicken from '@/assets/svgs/chicken.svg?react';
import Marker from '@/assets/svgs/marker.svg?react';
import MarkerShadow from '@/assets/svgs/marker-shadow.svg?react';
import useStore from '@/store';

interface RestaurantMarkerProps {
  restaurant: Restaurant;
}

export const RestaurantMarker = memo(
  ({ restaurant }: RestaurantMarkerProps) => {
    const [map] = useStore((state) => [state.map]);

    const [mySelect] = useStore((state) => [state.mySelect]);

    const [setRestaurantId] = useStore((state) => [state.setRestaurantId]);

    const [restaurantId] = useStore((state) => [state.restaurantId]);

    useEffect(() => {
      if (!map) {
        return;
      }

      const { id, lat, lng } = restaurant;

      const isActive = restaurantId === id;

      const isSelect = mySelect.includes(id);

      const marker = new naver.maps.Marker({
        map,
        position: new naver.maps.LatLng(lat, lng),
        icon: {
          content: renderToString(
            <div
              className={`relative aspect-[1/1.22] -translate-x-[50%] -translate-y-full transition-all ${isActive ? 'z-50 w-14' : 'w-12'}`}
            >
              <MarkerShadow className="w-13 absolute bottom-[-6px] left-[40%]" />
              <Marker
                className={`absolute left-0 top-0 text-bg-secondary ${isSelect ? 'text-primary' : isActive ? 'text-bg' : ''} ${isActive ? 'stroke-white' : ''}`}
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
    }, [restaurantId, map, restaurant, setRestaurantId, mySelect]);

    return <div>{/* MapMarker 함수 컴포넌트 */}</div>;
  }
);
