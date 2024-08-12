import { type StateCreator } from 'zustand';

type BottomSheetSlice = {
  sheetIsOpen: boolean;
  setSheetIsOpen: (state: boolean) => void;
};

export const createBottomSheetSlice: StateCreator<BottomSheetSlice> = (set): BottomSheetSlice => ({
  sheetIsOpen: false,
  setSheetIsOpen(state: boolean) {
    set(() => ({ sheetIsOpen: state }));
  },
});
