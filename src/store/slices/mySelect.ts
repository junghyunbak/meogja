import { type StateCreator } from 'zustand';

type MySelectSlice = {
  mySelect: RestaurantId[];
  setMySelect: (select: RestaurantId[]) => void;
};

export const createMySelectSlice: StateCreator<MySelectSlice> = (
  set
): MySelectSlice => ({
  mySelect: [],
  setMySelect: function (...params) {
    const [tmp] = params;

    if (tmp instanceof Function) {
      const fn = tmp;

      set((state) => ({ mySelect: fn(state.mySelect) }));

      return;
    }

    const select = tmp;

    set(() => ({ mySelect: select }));
  },
});
