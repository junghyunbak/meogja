import { type StateCreator } from 'zustand';

type MySelectSlice = {
  mySelect: RestaurantId[];
  setMySelect: (
    param: RestaurantId[] | ((prev: RestaurantId[]) => RestaurantId[])
  ) => void;
};

export const createMySelectSlice: StateCreator<MySelectSlice> = (
  set
): MySelectSlice => ({
  mySelect: [],
  setMySelect: function (param) {
    if (param instanceof Function) {
      const fn = param;

      set((state) => ({ mySelect: fn(state.mySelect) }));

      return;
    }

    const select = param;

    set(() => ({ mySelect: select }));
  },
});
