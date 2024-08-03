import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { devtools } from 'zustand/middleware';

import { createRestaurantSlice } from './slices/restaurant';
import { createMapSlice } from './slices/map';

export type StoreState = ReturnType<typeof createRestaurantSlice> &
  ReturnType<typeof createMapSlice>;

const useStoreBase = create<StoreState>()(
  devtools((...a) => ({
    ...createRestaurantSlice(...a),
    ...createMapSlice(...a),
  }))
);

const useStore = <T>(selector: (state: StoreState) => T) => {
  return useStoreBase(selector, shallow);
};

export default useStore;
