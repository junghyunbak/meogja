import React, { useRef } from 'react';
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

const BottomSheetModalMain = ({ children }: ResponsiveBottomSheetProps) => {
  const sheetRef = useRef<SheetRef>();

  const [sheetState] = useStore((state) => [state.sheetState]);

  const SheetContent = React.Children.toArray(children)
    .filter((child) => React.isValidElement(child))
    .find(({ type }) => type === sheetStateToType[sheetState]);

  /**
   * 시트 현재 상태에 따른 snap point 설정
   *
   * [ ]: `maximum call stack size exceeded` 에러 발생으로 비활성화
   */

  /*
  useEffect(() => {
    if (!sheetRef.current) {
      return;
    }

    switch (sheetState) {
      case 'picky':
      case 'rank':
      case 'select':
        sheetRef.current.snapTo(1);
        break;

      case 'chat':
        sheetRef.current.snapTo(0);
        break;
    }
  }, [sheetState]);
  */

  /**
   * react-`modal`-sheet 이지만, 항상 열어두고 snapTo로 위치만 이동하는 식으로 구현
   */
  return (
    <Sheet
      ref={sheetRef}
      isOpen
      onClose={() => {
        sheetRef.current?.snapTo(2);
      }}
      snapPoints={[0.85, 0.5, 150]}
      initialSnap={2}
      className="mx-auto max-w-[600px]"
    >
      <Sheet.Container className="!left-auto cursor-grab !bg-transparent !shadow-none active:cursor-grabbing">
        <div className="flex h-[120px] cursor-default flex-col justify-end">
          <div className="mb-3 ml-[16px]">
            <Timer />
          </div>
          <RestaurantCards />
        </div>

        <Sheet.Header className="px-[16px]">
          <div className="h-[30px] rounded-t-md bg-bg pt-[7px]">
            <div className="mx-auto h-[4px] w-[33%] bg-white" />
          </div>
        </Sheet.Header>

        <Sheet.Content className="mx-[16px] bg-bg">
          {SheetContent}
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};

export const BottomSheetModal = Object.assign(BottomSheetModalMain, {
  Rank: BottomSheetModalRank,
});
