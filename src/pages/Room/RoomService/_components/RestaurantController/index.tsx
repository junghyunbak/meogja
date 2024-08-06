import { useContext } from 'react';

import { ImmutableRoomInfoContext } from '@/pages/Room';

import useStore from '@/store';

import './index.css';

export function RestaurantController() {
  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const [currentRestaurantId] = useStore((state) => [state.currentRestaurantId]);

  if (!currentRestaurantId) {
    return;
  }

  const restaurant = restaurants.find(({ id }) => id === currentRestaurantId);

  return (
    <div className="restaurant-controller">
      {restaurant && (
        <div className="restaurant-controller-button">
          <p>{restaurant.name}</p>
          <div>
            <p>먹는다</p>
          </div>
          <div>
            <p>더럽힌다</p>
          </div>
          <div>
            <p>자세히 관찰한다</p>
          </div>
        </div>
      )}
    </div>
  );
}
