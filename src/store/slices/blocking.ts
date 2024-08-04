import React from 'react';
import { type StateCreator } from 'zustand';

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
