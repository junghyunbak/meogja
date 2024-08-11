import { useContext } from 'react';

import { useUpdateSelect } from '@/hooks/useUpdateSelect';

import useStore from '@/store';

import './index.css';
import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';

export function RestaurantController() {
  const { restaurants, maxPickCount } = useContext(ImmutableRoomInfoContext);
  const userId = useContext(UserIdContext);
  const roomId = useContext(RoomIdContext);

  const [map] = useStore((state) => [state.map]);
  const [mySelect, setMySelect] = useStore((state) => [state.mySelect, state.setMySelect]);
  const [currentRestaurantId] = useStore((state) => [state.currentRestaurantId]);
  const [setSheetIsOpen] = useStore((state) => [state.setSheetIsOpen]);

  const { updateMySelectMutation } = useUpdateSelect({ roomId, userId });

  const handleSelectButtonClick = (restaurant: Restaurant) => {
    return () => {
      if (maxPickCount - mySelect.length <= 0) {
        return;
      }

      setMySelect((prev) => {
        const next = [...prev];

        const idx = next.indexOf(restaurant.id);

        if (idx !== -1) {
          return prev;
        }

        next.push(restaurant.id);

        return next;
      });

      map?.setCenter(new naver.maps.LatLng(restaurant.lat, restaurant.lng));

      updateMySelectMutation.mutate(restaurant.id);
    };
  };

  const handleUnselectButtonClick = (restaurant: Restaurant) => {
    return () => {
      setMySelect((prev) => {
        const next = [...prev];

        const idx = next.indexOf(restaurant.id);

        if (idx === -1) {
          return prev;
        }

        next.splice(idx, 1);

        return next;
      });

      map?.setCenter(new naver.maps.LatLng(restaurant.lat, restaurant.lng));

      updateMySelectMutation.mutate(restaurant.id);
    };
  };

  const handleShowDetailButtonClick = (restaurant: Restaurant) => {
    return () => {
      map?.setCenter(new naver.maps.LatLng(restaurant.lat, restaurant.lng));

      setSheetIsOpen(true);
    };
  };

  if (!currentRestaurantId) {
    return null;
  }

  const restaurant = restaurants.find(({ id }) => id === currentRestaurantId);

  if (!restaurant) {
    return null;
  }

  const remain = maxPickCount - mySelect.length;

  return (
    <div className="restaurant-controller">
      <div className="restaurant-controller-button">
        <p>{restaurant.name}</p>

        {!mySelect.includes(restaurant.id) ? (
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
