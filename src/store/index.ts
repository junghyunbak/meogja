import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';

import { createRestaurantSlice } from './slices/restaurant';
import { createMapSlice } from './slices/map';
import { createBottomSheetSlice } from './slices/bottomSheet';
import { createMutableRoomInfoSlice } from './slices/mutableRoomInfo';
import { createMyRoomInfoSlice } from './slices/myRoomInfo';
import { createBlockingSlice } from './slices/blocking';

export type StoreState = ReturnType<typeof createRestaurantSlice> &
  ReturnType<typeof createMapSlice> &
  ReturnType<typeof createBottomSheetSlice> &
  ReturnType<typeof createMutableRoomInfoSlice> &
  ReturnType<typeof createMyRoomInfoSlice> &
  ReturnType<typeof createBlockingSlice>;

const useStoreBase = create<StoreState>()(
  persist(
    (...a) => ({
      ...createRestaurantSlice(...a),
      ...createMapSlice(...a),
      ...createBottomSheetSlice(...a),
      ...createMutableRoomInfoSlice(...a),
      ...createMyRoomInfoSlice(...a),
      ...createBlockingSlice(...a),
    }),
    {
      name: 'zustandStore',
      partialize: (state) => ({
        sheetState: state.sheetState,
      }),
    }
  )
);

const useStore = <T>(selector: (state: StoreState) => T) => {
  return useStoreBase(selector, shallow);
};

export default useStore;
