import { useContext } from 'react';

import { IdentifierContext, ImmutableRoomInfoContext } from '@/pages/Room';

import { useUpdateSelect } from '@/hooks/useUpdateSelect';

import useStore from '@/store';

import './index.css';
import { useUpdatePicky } from '@/hooks/useUpdatePicky';

export function RestaurantController() {
  const { restaurants } = useContext(ImmutableRoomInfoContext);
  const { userId, roomId } = useContext(IdentifierContext);

  const [mySelect, setMySelect] = useStore((state) => [state.mySelect, state.setMySelect]);
  const [myPicky, setMyPicky] = useStore((state) => [state.myPicky, state.setMyPicky]);
  const [currentRestaurantId] = useStore((state) => [state.currentRestaurantId]);
  const [setSheetIsOpen] = useStore((state) => [state.setSheetIsOpen]);

  const { updateMySelectMutation } = useUpdateSelect({ roomId, userId });
  const { updateMyPickyMutation } = useUpdatePicky({ roomId, userId });

  const handleChooseButtonClick = (restaurantId: string) => {
    return () => {
      /**
       * 낙관적 처리
       */
      setMySelect((prev) => {
        const next = [...prev];

        const idx = next.indexOf(restaurantId);

        if (idx === -1) {
          next.push(restaurantId);
        } else {
          next.splice(idx, 1);
        }

        return next;
      });

      updateMySelectMutation.mutate(restaurantId);
    };
  };

  const handleDurtyButtonClick = (restaurantId: RestaurantId) => {
    return () => {
      /**
       * 낙관적 처리
       */
      setMyPicky((prev) => {
        const next = [...prev];

        const idx = next.indexOf(restaurantId);

        if (idx === -1) {
          next.push(restaurantId);
        } else {
          next.splice(idx, 1);
        }

        return next;
      });
      updateMyPickyMutation.mutate(restaurantId);
    };
  };

  const handleShowDetailButtonClick = () => {
    setSheetIsOpen(true);
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
        <div onClick={handleChooseButtonClick(restaurant.id)}>
          <p>{mySelect.includes(restaurant.id) ? '뱉는다' : '먹는다'}</p>
        </div>
        <div onClick={handleDurtyButtonClick(restaurant.id)}>
          <p>{myPicky.includes(restaurant.id) ? '치운다' : '더럽힌다'}</p>
        </div>
        <div onClick={handleShowDetailButtonClick}>
          <p>자세히 관찰한다</p>
        </div>
      </div>
    </div>
  );
}
