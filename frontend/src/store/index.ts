import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';

import { createRestaurantSlice } from './slices/restaurant';
import { createBottomSheetSlice } from './slices/bottomSheet';

export type StoreState = ReturnType<typeof createRestaurantSlice> & ReturnType<typeof createBottomSheetSlice>;

const useStoreBase = create<StoreState>()(
  persist(
    (...a) => ({
      ...createRestaurantSlice(...a),
      ...createBottomSheetSlice(...a),
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
