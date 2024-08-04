import { RESTAURANT_KIND } from '@/constants';
import { useUpdatePicky } from '@/hooks/useUpdatePicky';
import { IdentifierContext } from '@/pages/Room';
import useStore from '@/store';
import { useContext } from 'react';

export function BottomSheetContentPicky() {
  const { userId, roomId } = useContext(IdentifierContext);

  const [myPicky, setMyPicky] = useStore((state) => [
    state.myPicky,
    state.setMyPicky,
  ]);

  const { updateMyPickyMutation } = useUpdatePicky(roomId, userId);

  const handlePickyItemClick = (restaurantKind: RestaurantKind) => {
    return () => {
      updateMyPickyMutation.mutate(restaurantKind);

      /**
       * 낙관적 업데이트
       */
      setMyPicky((prev) => {
        return prev === restaurantKind ? null : restaurantKind;
      });
    };
  };

  return (
    <div className="flex flex-col items-center px-5">
      <p className="text-white">이것 만큼은 먹기 싫다!</p>
      <div className="flex w-full flex-wrap pt-3">
        {RESTAURANT_KIND.map(({ kind, svg: RestaurantSvg, name }) => {
          const isSelect = myPicky === kind;

          return (
            <div
              className="mb-3 flex w-1/4 cursor-pointer items-center justify-center p-3"
              onClick={handlePickyItemClick(kind)}
              key={kind}
            >
              <div
                className={`flex w-1/3 flex-col items-center gap-2 ${isSelect ? 'text-primary' : 'text-white'}`}
              >
                <RestaurantSvg />
                <p className="text-nowrap text-xs">{name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
