import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { devtools } from 'zustand/middleware';

import { createRestaurantSlice } from './slices/restaurant';

export type StoreState = ReturnType<typeof createRestaurantSlice>;

const useStoreBase = create<StoreState>()(
  devtools((...a) => ({ ...createRestaurantSlice(...a) }))
);

const useStore = <T>(selector: (state: StoreState) => T) => {
  return useStoreBase(selector, shallow);
};

export default useStore;
