import { useContext } from 'react';

import { RestaurantMarker } from '@/components/naverMap/overlay/marker';

import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';

import useStore from '@/store';

export function MapRestaurants() {
  const { restaurants } = useContext(ImmutableRoomInfoContext);
  const userId = useContext(UserIdContext);

  const [map] = useStore((state) => [state.map]);
  const [user] = useStore((state) => [state.user]);
  const [mySelect] = useStore((state) => [state.mySelect]);
  const [showOnlyEaten] = useStore((state) => [state.showOnlyEaten]);
  const [currentCategory] = useStore((state) => [state.currentCategory]);

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

  return (
    <>
      {restaurants.map((restaurant) => {
        const isInCategory =
          currentCategory === null ? true : restaurant.categoryName.includes(currentCategory) ? true : false;

        return (
          <RestaurantMarker
            key={restaurant.id}
            map={map}
            restaurant={restaurant}
            count={restaurantIdToUserIdSet.get(restaurant.id)?.size || 0}
            isVisible={!isInCategory ? false : showOnlyEaten ? mySelect.includes(restaurant.id) : true}
          />
        );
      })}
    </>
  );
}
