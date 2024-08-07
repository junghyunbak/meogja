import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';

import { createRestaurantSlice } from './slices/restaurant';
import { createMapSlice } from './slices/map';
import { createBottomSheetSlice } from './slices/bottomSheet';
import { createMutableRoomInfoSlice } from './slices/mutableRoomInfo';
import { createMyRoomInfoSlice } from './slices/myRoomInfo';

export type StoreState = ReturnType<typeof createRestaurantSlice> &
  ReturnType<typeof createMapSlice> &
  ReturnType<typeof createBottomSheetSlice> &
  ReturnType<typeof createMutableRoomInfoSlice> &
  ReturnType<typeof createMyRoomInfoSlice>;

const useStoreBase = create<StoreState>()(
  persist(
    (...a) => ({
      ...createRestaurantSlice(...a),
      ...createMapSlice(...a),
      ...createBottomSheetSlice(...a),
      ...createMutableRoomInfoSlice(...a),
      ...createMyRoomInfoSlice(...a),
    }),
    {
      name: 'zustandStore',
      partialize: () => ({}),
    }
  )
);

const useStore = <T>(selector: (state: StoreState) => T) => {
  return useStoreBase(selector, shallow);
};

export default useStore;
