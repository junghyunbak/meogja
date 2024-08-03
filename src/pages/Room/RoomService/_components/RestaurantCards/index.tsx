import { IdentifierContext, ImmutableRoomInfoContext } from '@/pages/Room';
import useStore from '@/store';
import { useContext, useEffect, useState } from 'react';
import Checkbox from '@/assets/svgs/checkbox.svg?react';
import { useMutation } from 'react-query';
import axios from 'axios';

interface RestaurantCardsProps {
  select: string[];
}

export const RestaurantCards = ({ select }: RestaurantCardsProps) => {
  const { userId, roomId } = useContext(IdentifierContext);
  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const [restaurantId] = useStore((state) => [state.restaurantId]);

  const [mySelect, setMySelect] = useState<string[]>([...select]);

  const updateMySelectMutation = useMutation({
    mutationKey: [],
    mutationFn: async () => {
      await axios.patch('/api/update-user-select', {
        userId,
        roomId,
        restaurantId,
      });
    },
  });

  useEffect(() => {
    setMySelect(select);
  }, [select]);

  const handleChooseButtonClick = () => {
    if (!restaurantId) {
      return;
    }

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

    updateMySelectMutation.mutate();
  };

  const restaurant = restaurants.find(({ id }) => restaurantId === id);

  if (!restaurantId || !restaurant) {
    return null;
  }

  const isSelect = mySelect.includes(restaurant.id);

  return (
    <div className="flex w-full gap-3 rounded-md bg-bg p-3">
      <div
        className="flex aspect-square h-12 cursor-pointer"
        onClick={handleChooseButtonClick}
      >
        <Checkbox
          className={[
            'size-full',
            isSelect ? 'text-primary' : 'text-bg-secondary',
          ].join(' ')}
        />
      </div>

      <div className="flex flex-col justify-between">
        <p className="text-white">{restaurant.name}</p>
        <p className="text-sm text-gray-400">
          현재 내 위치로부터 떨어져 있습니다.
        </p>
      </div>
    </div>
  );
};
