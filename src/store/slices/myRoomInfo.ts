import { RIGHT } from '@/constants';
import { type StateCreator } from 'zustand';

type MyRoomInfoSlice = {
  // [ ]: myHomeLatLng 으로 네이밍 변경
  myLatLng: { lat: number; lng: number };
  setMyLatLng: (lat: number, lng: number) => void;

  myName: string;
  setMyName: (myName: string) => void;

  mySelect: RestaurantId[];
  setMySelect: (param: RestaurantId[] | ((prev: RestaurantId[]) => RestaurantId[])) => void;

  myMapLatLng: { lat: number; lng: number };
  setMyMapLatLng: (lat: number, lng: number) => void;

  myDirection: LEFT | RIGHT;
  setMyDirection: (direction: LEFT | RIGHT) => void;
};

export const createMyRoomInfoSlice: StateCreator<MyRoomInfoSlice> = (set): MyRoomInfoSlice => ({
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

  myMapLatLng: { lat: 0, lng: 0 },
  setMyMapLatLng(lat: number, lng: number) {
    set(() => ({ myMapLatLng: { lat, lng } }));
  },

  myDirection: RIGHT,
  setMyDirection(direction) {
    set(() => ({ myDirection: direction }));
  },
});
