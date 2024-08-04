import { type StateCreator } from 'zustand';

type MyNameSlice = {
  myName: string;
  setMyName: (myName: string) => void;
};

export const createMyNameSlice: StateCreator<MyNameSlice> = (
  set
): MyNameSlice => ({
  myName: '',
  setMyName: function (myName: string) {
    set(() => ({ myName }));
  },
});
