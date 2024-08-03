import { type StateCreator } from 'zustand';

type BottomSheetSlice = {
  sheetState: SheetState;
  setSheetState: (state: SheetState) => void;
};

export const createBottomSheetSlice: StateCreator<BottomSheetSlice> = (
  set
): BottomSheetSlice => ({
  sheetState: 'close',
  setSheetState: (state: SheetState) => {
    set(() => ({
      sheetState: state,
    }));
  },
});
