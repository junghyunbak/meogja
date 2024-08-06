import { useContext } from 'react';

import { IdentifierContext, ImmutableRoomInfoContext } from '@/pages/Room';

import { useUpdateSelect } from '@/hooks/useUpdateSelect';

import useStore from '@/store';

import './index.css';
import { useUpdatePicky } from '@/hooks/useUpdatePicky';

export function RestaurantController() {
  const { restaurants } = useContext(ImmutableRoomInfoContext);
  const { userId, roomId } = useContext(IdentifierContext);

  const [map] = useStore((state) => [state.map]);
  const [mySelect, setMySelect] = useStore((state) => [state.mySelect, state.setMySelect]);
  const [myPicky, setMyPicky] = useStore((state) => [state.myPicky, state.setMyPicky]);
  const [currentRestaurantId] = useStore((state) => [state.currentRestaurantId]);
  const [setSheetIsOpen] = useStore((state) => [state.setSheetIsOpen]);

  const { updateMySelectMutation } = useUpdateSelect({ roomId, userId });
  const { updateMyPickyMutation } = useUpdatePicky({ roomId, userId });

  const handleChooseButtonClick = (restaurant: Restaurant) => {
    return () => {
      /**
       * 낙관적 처리
       */
      setMySelect((prev) => {
        const next = [...prev];

        const idx = next.indexOf(restaurant.id);

        if (idx === -1) {
          next.push(restaurant.id);
        } else {
          next.splice(idx, 1);
        }

        return next;
      });

      map?.setCenter(new naver.maps.LatLng(restaurant.lat, restaurant.lng))

      updateMySelectMutation.mutate(restaurant.id);
    };
  };

  const handleDurtyButtonClick = (restaurant: Restaurant) => {
    return () => {
      /**
       * 낙관적 처리
       */
      setMyPicky((prev) => {
        const next = [...prev];

        const idx = next.indexOf(restaurant.id);

        if (idx === -1) {
          next.push(restaurant.id);
        } else {
          next.splice(idx, 1);
        }

        return next;
      });

      map?.setCenter(new naver.maps.LatLng(restaurant.lat, restaurant.lng))

      updateMyPickyMutation.mutate(restaurant.id);
    };
  };

  const handleShowDetailButtonClick = (restaurant: Restaurant) => {

    return () => {
      map?.setCenter(new naver.maps.LatLng(restaurant.lat, restaurant.lng))

      setSheetIsOpen(true);
    }
  };

  if (!currentRestaurantId) {
    return null;
  }

  const restaurant = restaurants.find(({ id }) => id === currentRestaurantId);

  if (!restaurant) {
    return null;
  }

  return (
    <div className="restaurant-controller">
      <div className="restaurant-controller-button">
        <p>{restaurant.name}</p>
        <div onClick={handleChooseButtonClick(restaurant)}>
          <p>{mySelect.includes(restaurant.id) ? '뱉는다' : '먹는다'}</p>
        </div>
        <div onClick={handleDurtyButtonClick(restaurant)}>
          <p>{myPicky.includes(restaurant.id) ? '치운다' : '더럽힌다'}</p>
        </div>
        <div onClick={handleShowDetailButtonClick(restaurant)}>
          <p>자세히 관찰한다</p>
        </div>
      </div>
    </div>
  );
}
