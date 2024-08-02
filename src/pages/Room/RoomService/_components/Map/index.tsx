import { memo, useEffect, useContext, useState } from 'react';
import { ImmutableRoomInfoContext } from '@/pages/Room';
import { MapMarker } from './MapMarker';

export const Map = memo(() => {
  const { lat, lng, restaurants } = useContext(ImmutableRoomInfoContext);

  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useEffect(() => {
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(lat, lng),
    });

    setMap(map);
  }, []);

  return (
    <>
      <div className="flex-1" id="map" />
      {map &&
        restaurants.map((restaurant) => {
          return (
            <MapMarker map={map} restaurant={restaurant} key={restaurant.id} />
          );
        })}
    </>
  );
});
