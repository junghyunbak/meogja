import { IdentifierContext } from '@/pages/Room';
import useStore from '@/store';
import { useContext } from 'react';
import Checkbox from '@/assets/svgs/checkbox.svg?react';
import Chevron from '@/assets/svgs/chevron.svg?react';
import * as geolib from 'geolib';
import { useUpdateSelect } from '@/hooks/useUpdateSelect';

interface BottomSheetExternalRestaurantPreviewItemProps {
  restaurant: Restaurant;
}

export function BottomSheetExternalRestaurantPreviewItem({
  restaurant,
}: BottomSheetExternalRestaurantPreviewItemProps) {
  const [mySelect, setMySelect] = useStore((state) => [
    state.mySelect,
    state.setMySelect,
  ]);
  const [myLatLng] = useStore((state) => [state.myLatLng]);

  const { userId, roomId } = useContext(IdentifierContext);

  const { updateMySelectMutation } = useUpdateSelect(
    roomId,
    userId,
    restaurant.id
  );

  const handleChooseButtonClick = () => {
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

    updateMySelectMutation.mutate();
  };

  const isSelect = mySelect.includes(restaurant.id);

  const km = Math.floor(
    geolib.getDistance(
      { latitude: myLatLng.lat, longitude: myLatLng.lng },
      { latitude: restaurant.lat, longitude: restaurant.lng }
    ) / 1000
  );

  return (
    <div className="pointer-events-auto mx-[4px]">
      <div className="flex w-full cursor-grab gap-3 rounded-md bg-bg p-3 active:cursor-grabbing">
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
          <a
            className="flex cursor-pointer items-center gap-2 text-white"
            target="_blank"
            onDragStart={(e) => e.preventDefault()}
            href={restaurant.placeUrl}
          >
            <p className="truncate">{restaurant.name}</p>
            <Chevron className="h-3 rotate-180" />
          </a>
          <p className="text-sm text-gray-400">
            현재 내 위치로부터 약 <span className="text-primary">{km}km</span>
            떨어져 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
