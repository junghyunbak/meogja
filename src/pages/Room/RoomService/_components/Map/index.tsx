import { memo, useEffect, useContext } from 'react';
import { ImmutableRoomInfoContext } from '@/pages/Room';
import useStore from '@/store';

export const Map = memo(() => {
  const { lat, lng } = useContext(ImmutableRoomInfoContext);

  const [setMap] = useStore((state) => [state.setMap]);

  const [setRestaurantId] = useStore((state) => [state.setRestaurantId]);

  useEffect(() => {
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(lat, lng),
    });

    const listener = naver.maps.Event.addListener(map, 'click', () => {
      setRestaurantId(null);
    });

    setMap(map);

    return () => {
      naver.maps.Event.removeListener(listener);
    };
  }, []);

  return <div className="size-full" id="map" />;
});
