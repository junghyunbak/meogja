import React, { useEffect, useContext } from 'react';
import { ImmutableRoomInfoContext } from '@/pages/Room';
import useStore from '@/store';
import { RestaurantMarker } from './overlay/marker';
import { AcitivityRadius } from './overlay/polygon';

const restaurantMarkerType = (
  <RestaurantMarker restaurant={{} as Restaurant} />
).type;
const activityRadiusType = (<AcitivityRadius />).type;

interface MapMainProps {
  children?: React.ReactNode;
}

function MapMain({ children }: MapMainProps) {
  const { lat, lng } = useContext(ImmutableRoomInfoContext);

  const [setMap] = useStore((state) => [state.setMap]);
  const [setCurrentRestaurantId] = useStore((state) => [
    state.setCurrentRestaurantId,
  ]);

  useEffect(() => {
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(lat, lng),
    });

    const listener = naver.maps.Event.addListener(map, 'click', () => {
      setCurrentRestaurantId(null);
    });

    setMap(map);

    return () => {
      naver.maps.Event.removeListener(listener);
    };
  }, [setMap, setCurrentRestaurantId, lat, lng]);

  const restaurantMarkers = React.Children.toArray(children).filter(
    (child) =>
      React.isValidElement(child) && child.type === restaurantMarkerType
  );

  const [activityRadius] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === activityRadiusType
  );

  return (
    <>
      <div className="flex-1" id="map" />

      {restaurantMarkers}

      {activityRadius}
    </>
  );
}

export const Map = Object.assign(MapMain, {
  RestaurantMarker: RestaurantMarker,
  ActivityRadius: AcitivityRadius,
});
