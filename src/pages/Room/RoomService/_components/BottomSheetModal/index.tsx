import React, { useEffect, useRef } from 'react';
import useStore from '@/store';
import { Sheet, SheetRef } from 'react-modal-sheet';
import { BottomSheetModalRank } from './BottomSheetModalRank';

interface ResponsiveBottomSheetProps {
  children?: React.ReactNode;
}

const rankType = (<BottomSheetModalRank />).type;

const sheetStateToType: Partial<Record<SheetState, unknown>> = {
  rank: rankType,
};

const BottomSheetModalMain = ({ children }: ResponsiveBottomSheetProps) => {
  const sheetRef = useRef<SheetRef>();

  const [sheetState, setSheetState] = useStore((state) => [
    state.sheetState,
    state.setSheetState,
  ]);

  const SheetContent = React.Children.toArray(children)
    .filter((child) => React.isValidElement(child))
    .find(({ type }) => type === sheetStateToType[sheetState]);

  /**
   * 시트 현재 상태에 따른 snap point 설정
   */
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

  return (
    <Sheet
      ref={sheetRef}
      isOpen={sheetState !== 'close'}
      onClose={() => {
        setSheetState('close');
      }}
      snapPoints={[0.85, 0.5]}
      initialSnap={1}
      className="mx-auto max-w-[600px]"
    >
      <Sheet.Container className="!left-auto cursor-grab !bg-transparent px-[16px] !shadow-none active:cursor-grabbing">
        <Sheet.Header>
          <div className="h-[25px] rounded-t-md bg-bg pt-[7px]">
            <div className="mx-auto h-[4px] w-[33%] bg-white" />
          </div>
        </Sheet.Header>

        <Sheet.Content className="bg-bg">{SheetContent}</Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};

export const BottomSheetModal = Object.assign(BottomSheetModalMain, {
  Rank: BottomSheetModalRank,
});
