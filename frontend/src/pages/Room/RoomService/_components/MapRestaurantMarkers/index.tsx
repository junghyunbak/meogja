import { useContext } from 'react';

import { RestaurantMarker } from '@/components/naverMap/overlay/marker';

import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';
import { MutableRoomInfoStoreContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';
import { MapContext } from '../..';

import useGlobalStore from '@/store';
import { useStore } from 'zustand';

export const MapRestaurantMarkers = () => {
  const myId = useContext(UserIdContext);

  const [user] = useStore(useContext(MutableRoomInfoStoreContext), (s) => [s.user]);

  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const { map } = useContext(MapContext);

  const [showOnlyEaten] = useGlobalStore((state) => [state.showOnlyEaten]);

  const [currentCategory] = useGlobalStore((state) => [state.currentCategory]);

  const restaurantIdToUserIdSet = new Map<RestaurantId, Set<UserId>>();

  Object.entries(user).forEach(([userId, userData]) => {
    userData.select.forEach((restaurantId) => {
      if (!restaurantIdToUserIdSet.has(restaurantId)) {
        restaurantIdToUserIdSet.set(restaurantId, new Set());
      }

      restaurantIdToUserIdSet.get(restaurantId)?.add(userId);
    });
  });

  return (
    <>
      {restaurants.map((restaurant) => {
        /**
         * 1. 현재 선택된 카테고리에 속하는지 여부 계산
         */
        const isInCategory = (() => {
          // `null`일 경우 전체 카테고리를 의미
          if (currentCategory === null) {
            return true;
          }

          if (restaurant.categoryName.includes(currentCategory)) {
            return true;
          }

          return false;
        })();

        /**
         * 2. 선택되어 있는지 여부 계산
         */
        const isEaten = (() => {
          const me = user[myId];

          if (!me) {
            return false;
          }

          if (!me.select.includes(restaurant.id)) {
            return false;
          }

          return true;
        })();

        /**
         * 1, 2를 토대로 보여질 지 여부를 최종 계산
         */
        const isVisible = (() => {
          if (!isInCategory) {
            return false;
          }

          if (showOnlyEaten && !isEaten) {
            return false;
          }

          return true;
        })();

        return (
          <RestaurantMarker
            key={restaurant.id}
            map={map}
            restaurant={restaurant}
            count={restaurantIdToUserIdSet.get(restaurant.id)?.size || 0}
            isVisible={isVisible}
          />
        );
      })}
    </>
  );
};
