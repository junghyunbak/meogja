import { useContext } from 'react';

import { useUpdateSelect } from '@/hooks/useUpdateSelect';

import { useStore } from 'zustand';
import useGlobalStore from '@/store';

import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';
import { MutableRoomInfoStoreContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';
import { MapContext } from '../..';

import _ from 'lodash';

import './index.css';

export function RestaurantController() {
  const myId = useContext(UserIdContext);

  const roomId = useContext(RoomIdContext);

  const { restaurants, maxPickCount } = useContext(ImmutableRoomInfoContext);

  const { map } = useContext(MapContext);

  const [user, setUser] = useStore(useContext(MutableRoomInfoStoreContext), (s) => [s.user, s.setUser]);

  const [currentRestaurantId] = useGlobalStore((state) => [state.currentRestaurantId]);

  const [setSheetIsOpen] = useGlobalStore((state) => [state.setSheetIsOpen]);

  const { updateMySelectMutation } = useUpdateSelect({ roomId, userId: myId });

  const handleSelectButtonClick = (restaurant: Restaurant) => {
    return () => {
      const me = user[myId];

      if (!me) {
        return;
      }

      if (maxPickCount - me.select.length <= 0) {
        return;
      }

      setUser((prev) => {
        const next = _.cloneDeep(prev);

        const { select } = next[myId];

        const idx = select.indexOf(restaurant.id);

        if (idx !== -1) {
          return next;
        }

        select.push(restaurant.id);

        return next;
      });

      map.setCenter(new naver.maps.LatLng(restaurant.lat, restaurant.lng));

      updateMySelectMutation.mutate(restaurant.id);
    };
  };

  const handleUnselectButtonClick = (restaurant: Restaurant) => {
    return () => {
      const me = user[myId];

      if (!me) {
        return;
      }

      setUser((prev) => {
        const next = _.cloneDeep(prev);

        const { select } = next[myId];

        const idx = select.indexOf(restaurant.id);

        if (idx === -1) {
          return prev;
        }

        select.splice(idx, 1);

        return next;
      });

      map.setCenter(new naver.maps.LatLng(restaurant.lat, restaurant.lng));

      updateMySelectMutation.mutate(restaurant.id);
    };
  };

  const handleShowDetailButtonClick = (restaurant: Restaurant) => {
    return () => {
      map.setCenter(new naver.maps.LatLng(restaurant.lat, restaurant.lng));

      setSheetIsOpen(true);
    };
  };

  if (!currentRestaurantId) {
    return null;
  }

  const restaurant = restaurants.find(({ id }) => id === currentRestaurantId);

  const me = user[myId];

  if (!restaurant || !me) {
    return null;
  }

  const remain = maxPickCount - me.select.length;

  return (
    <div className="restaurant-controller">
      <div className="restaurant-controller-button">
        <p>{restaurant.name}</p>

        {!me.select.includes(restaurant.id) ? (
          <div
            onClick={handleSelectButtonClick(restaurant)}
            className={`${remain === 0 ? '!cursor-auto !bg-[#DDDDDD]' : ''}`}
          >
            <p>{`먹는다 (${remain})`}</p>
          </div>
        ) : (
          <div onClick={handleUnselectButtonClick(restaurant)}>
            <p>뱉는다</p>
          </div>
        )}

        <div onClick={handleShowDetailButtonClick(restaurant)}>
          <p>자세히 관찰한다</p>
        </div>
      </div>
    </div>
  );
}
