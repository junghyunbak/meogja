import { memo, useContext } from 'react';

import { RestaurantMarker } from '@/components/naverMap/overlay/marker';

import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';

import useGlobalStore from '@/store';

import { MapContext } from '../..';
import { MutableRoomInfoStoreContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';
import { useStore } from 'zustand';

export const MapRestaurantMarkers = () => {
  const mutableRoomInfoStore = useContext(MutableRoomInfoStoreContext);

  const [user] = useStore(mutableRoomInfoStore, (s) => [s.user]);

  const { restaurants } = useContext(ImmutableRoomInfoContext);
  const userId = useContext(UserIdContext);

  const { map } = useContext(MapContext);

  const [mySelect] = useGlobalStore((state) => [state.mySelect]);
  const [showOnlyEaten] = useGlobalStore((state) => [state.showOnlyEaten]);
  const [currentCategory] = useGlobalStore((state) => [state.currentCategory]);

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
};
