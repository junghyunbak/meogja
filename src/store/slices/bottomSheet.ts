import { type SheetRef } from 'react-modal-sheet';
import { type StateCreator } from 'zustand';

type BottomSheetSlice = {
  /**
   * 시트 상태가 같은 값으로 바뀌어도 상태변화를 일으켜야 하므로, 객체 형태로 상태를 설정
   */
  sheetState: { value: SheetState };
  setSheetState: (state: SheetState) => void;

  sheetRef: SheetRef | null;
  setSheetRef: (sheetRef: SheetRef | null) => void;
};

export const createBottomSheetSlice: StateCreator<BottomSheetSlice> = (
  set
): BottomSheetSlice => ({
  sheetState: { value: 'picky' },
  setSheetState: (state: SheetState) => {
    set(() => ({
      sheetState: { value: state },
    }));
  },

  sheetRef: null,
  setSheetRef: (sheetRef: SheetRef | null) => {
    set(() => ({ sheetRef }));
  },
});
