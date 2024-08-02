import { ImmutableRoomInfoContext } from '@/pages/Room';
import useStore from '@/store';
import { memo, useContext } from 'react';
import ChkboxFrame from '@/assets/svgs/chkbox-frame.svg?react';
import Check from '@/assets/svgs/check.svg?react';

interface RestaurantCardsProps {}

export const RestaurantCards = memo(() => {
  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const [restaurantId] = useStore((state) => [state.restaurantId]);

  const restaurantIdx = restaurants.findIndex(({ id }) => id === restaurantId);

  const restaurant = restaurants[restaurantIdx];

  const prevRestaurant = restaurants[restaurantIdx - 1];
  const nextRestaurant = restaurants[restaurantIdx + 1];

  if (!restaurantId || !restaurant) {
    return null;
  }

  console.log(restaurant.name);

  //console.log(prevRestaurant.name, nextRestaurant.name);

  return (
    <div className="flex w-full gap-3 rounded-md bg-bg p-3">
      <div className="relative flex aspect-square h-12 items-center justify-center">
        <Check className="absolute w-[60%] text-primary" />
        <ChkboxFrame className="absolute left-0 top-0 h-full text-bg-secondary" />
      </div>

      <div className="flex flex-col justify-between">
        <p className="text-white">{restaurant.name}</p>
        <p className="text-sm text-gray-400">
          현재 내 위치로부터 떨어져 있습니다.
        </p>
      </div>
    </div>
  );
});
