import { useContext } from 'react';

import { IdentifierContext, ImmutableRoomInfoContext } from '@/pages/Room';

import { RestaurantMarker } from '@/components/naverMap/overlay/marker';

import useStore from '@/store';

export function MapRestaurants() {
  const { restaurants } = useContext(ImmutableRoomInfoContext);
  const { userId } = useContext(IdentifierContext);

  const [map] = useStore((state) => [state.map]);
  const [user] = useStore((state) => [state.user]);
  const [mySelect] = useStore((state) => [state.mySelect]);

  const restaurantIdToUserIdSet = new Map<RestaurantId, Set<UserId>>();

  Object.entries(user)
    .filter(([otherUserId]) => otherUserId !== userId)
    .forEach(([userId, userData]) => {
      userData.select.forEach((restaurantId) => {
        if (!restaurantIdToUserIdSet.has(restaurantId)) {
          restaurantIdToUserIdSet.set(restaurantId, new Set());
        }

        restaurantIdToUserIdSet.get(restaurantId)?.add(userId);
      });
    });

  mySelect.forEach((restaurantId) => {
    if (!restaurantIdToUserIdSet.has(restaurantId)) {
      restaurantIdToUserIdSet.set(restaurantId, new Set());
    }

    restaurantIdToUserIdSet.get(restaurantId)?.add(userId);
  });

  console.log('myselect변화!', mySelect);

  return (
    <>
      {restaurants.map((restaurant) => {
        return (
          <RestaurantMarker
            key={restaurant.id}
            map={map}
            restaurant={restaurant}
            count={restaurantIdToUserIdSet.get(restaurant.id)?.size || 0}
          />
        );
      })}
    </>
  );
}
