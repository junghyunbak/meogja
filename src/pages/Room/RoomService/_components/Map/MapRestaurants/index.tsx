import { useContext } from 'react';

import { ImmutableRoomInfoContext } from '@/pages/Room';

import { RestaurantMarker } from '@/components/naverMap/overlay/marker';

import useStore from '@/store';

export function MapRestaurants() {
  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const [map] = useStore((state) => [state.map]);

  return (
    <>
      {restaurants.map((restaurant) => {
        return <RestaurantMarker key={restaurant.id} map={map} restaurant={restaurant} />;
      })}
    </>
  );
}
