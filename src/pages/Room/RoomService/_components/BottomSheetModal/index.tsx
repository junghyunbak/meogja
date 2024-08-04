import React, { useRef, useEffect } from 'react';
import useStore from '@/store';
import { Sheet, SheetRef } from 'react-modal-sheet';
import { BottomSheetModalRank } from './BottomSheetModalRank';
import { Timer } from '../Timer';

import { RestaurantCards } from '../RestaurantCards';

interface ResponsiveBottomSheetProps {
  children?: React.ReactNode;
}

const rankType = (<BottomSheetModalRank user={{}} />).type;

const sheetStateToType: Partial<Record<SheetState, unknown>> = {
  rank: rankType,
};

/**
 * react-`modal`-sheet 이지만, 항상 열어두고 snapTo로 위치만 이동하는 식으로 구현
 */
const BottomSheetModalMain = ({ children }: ResponsiveBottomSheetProps) => {
  const sheetRef = useRef<SheetRef>();

  const [sheetState, setSheetState] = useStore((state) => [
    state.sheetState,
    state.setSheetState,
  ]);

  const SheetContent = React.Children.toArray(children)
    .filter((child) => React.isValidElement(child))
    .find(({ type }) => type === sheetStateToType[sheetState.value]);

  useEffect(() => {
    if (!sheetRef.current) {
      return;
    }

    /**
     * "Snap point is out of bounds. Sheet height is `0` but snap point is 150"
     *
     * 에러를 해결하기 위해 현재 `MotionValue`가 0일 경우 snap하지 않도록 구현
     *
     * // [ ]: 이렇게 해결할 경우, 바텀시트가 최대로 열려있을 때에도 같은 경우로 처리되어 snap되지 않는 추가 문제가 발생
     */
    if (!sheetRef.current.y.get()) {
      return;
    }

    sheetRef.current?.snapTo(
      sheetState.value === 'close' ? 2 : sheetState.value === 'chat' ? 0 : 1
    );
  }, [sheetState]);

  const handleButtonSheetOnClose = () => {
    setSheetState('close');

    sheetRef.current?.snapTo(2);
  };

  return (
    <Sheet
      ref={sheetRef}
      isOpen
      onClose={handleButtonSheetOnClose}
      snapPoints={[0.85, 0.5, 150]}
      initialSnap={2}
      className="mx-auto max-w-[600px]"
    >
      <Sheet.Container className="!pointer-events-none !left-auto cursor-grab !bg-transparent !shadow-none active:cursor-grabbing">
        <div className="flex h-[120px] cursor-default flex-col justify-end">
          <div className="mb-3 ml-[16px]">
            <Timer />
          </div>
          <RestaurantCards className="pointer-events-auto mb-3" />
        </div>

        <Sheet.Header className="pointer-events-auto px-[16px]">
          <div className="h-[30px] rounded-t-md bg-bg pt-[7px]">
            <div className="mx-auto h-[4px] w-[33%] bg-white" />
          </div>
        </Sheet.Header>

        <Sheet.Content className="mx-[16px] cursor-default bg-bg">
          {SheetContent}
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};

export const BottomSheetModal = Object.assign(BottomSheetModalMain, {
  Rank: BottomSheetModalRank,
});
