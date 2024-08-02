import { memo, useEffect, useContext, useState } from 'react';
import { ImmutableRoomInfoContext } from '@/pages/Room';
import { MapMarker } from './MapMarker';
import { MapRadius } from './MapRadius';

import * as geolib from 'geolib';

export const Map = memo(() => {
  const { lat, lng, restaurants, radius } = useContext(
    ImmutableRoomInfoContext
  );

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
      {map && (
        <>
          {restaurants.map((restaurant) => {
            const dist = geolib.getDistance(
              { latitude: lat, longitude: lng },
              { latitude: restaurant.lat, longitude: restaurant.lng }
            );

            /*
            if (dist > radius) {
              return null;
            }
              */

            return (
              <MapMarker
                map={map}
                restaurant={restaurant}
                key={restaurant.id}
              />
            );
          })}
          <MapRadius map={map} />
        </>
      )}
    </>
  );
});
