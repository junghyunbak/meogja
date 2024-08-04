import { type StateCreator } from 'zustand';

type MyRoomInfoSlice = {
  myLatLng: { lat: number; lng: number };
  setMyLatLng: (lat: number, lng: number) => void;

  myName: string;
  setMyName: (myName: string) => void;

  mySelect: RestaurantId[];
  setMySelect: (
    param: RestaurantId[] | ((prev: RestaurantId[]) => RestaurantId[])
  ) => void;
};

export const createMyRoomInfoSlice: StateCreator<MyRoomInfoSlice> = (
  set
): MyRoomInfoSlice => ({
  myLatLng: { lat: 0, lng: 0 },
  setMyLatLng: function (lat: number, lng: number) {
    set(() => ({ myLatLng: { lat, lng } }));
  },

  myName: '',
  setMyName: function (myName: string) {
    set(() => ({ myName }));
  },

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
