import React from 'react';
import { type StateCreator } from 'zustand';

// [ ]: store가 생성될 때 default값으로 Ref값을 설정하는 식으로 코드 개선
// https://docs.pmnd.rs/zustand/guides/initialize-state-with-props
type BlockingSlice = {
  isUpdatingRef: React.MutableRefObject<boolean> | null;
  setIsUpdatingRef: (ref: React.MutableRefObject<boolean> | null) => void;
};

export const createBlockingSlice: StateCreator<BlockingSlice> = (
  set
): BlockingSlice => ({
  isUpdatingRef: null,
  setIsUpdatingRef: (ref: React.MutableRefObject<boolean> | null) => {
    set(() => ({ isUpdatingRef: ref }));
  },
});
