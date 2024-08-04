import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { devtools } from 'zustand/middleware';

import { createRestaurantSlice } from './slices/restaurant';
import { createMapSlice } from './slices/map';
import { createMySelectSlice } from './slices/mySelect';
import { createMyLatLngSlice } from './slices/myLatLng';
import { createBottomSheetSlice } from './slices/bottomSheet';
import { createMyNameSlice } from './slices/myName';
import { createMutableRoomInfoSlice } from './slices/mutableRoomInfo';

export type StoreState = ReturnType<typeof createRestaurantSlice> &
  ReturnType<typeof createMapSlice> &
  ReturnType<typeof createMySelectSlice> &
  ReturnType<typeof createMyLatLngSlice> &
  ReturnType<typeof createBottomSheetSlice> &
  ReturnType<typeof createMutableRoomInfoSlice> &
  ReturnType<typeof createMyNameSlice>;

const useStoreBase = create<StoreState>()(
  devtools((...a) => ({
    ...createRestaurantSlice(...a),
    ...createMapSlice(...a),
    ...createMySelectSlice(...a),
    ...createMyLatLngSlice(...a),
    ...createBottomSheetSlice(...a),
    ...createMyNameSlice(...a),
    ...createMutableRoomInfoSlice(...a),
  }))
);

const useStore = <T>(selector: (state: StoreState) => T) => {
  return useStoreBase(selector, shallow);
};

export default useStore;
