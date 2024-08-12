import { RIGHT } from '@/constants';
import { type StateCreator } from 'zustand';

type MyRoomInfoSlice = {
  myGpsLatLng: { lat: number; lng: number } | null;
  setMyGpsLatLng: (myGpsLatLng: { lat: number; lng: number } | null) => void;

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
  myGpsLatLng: null,
  setMyGpsLatLng(myGpsLatLng) {
    set(() => ({ myGpsLatLng }));
  },

  myName: '',
  setMyName(myName) {
    set(() => ({ myName }));
  },

  mySelect: [],
  setMySelect(param) {
    if (param instanceof Function) {
      const fn = param;

      set((state) => ({ mySelect: fn(state.mySelect) }));

      return;
    }

    const select = param;

    set(() => ({ mySelect: select }));
  },

  myMapLatLng: { lat: 0, lng: 0 },
  setMyMapLatLng(lat, lng) {
    set(() => ({ myMapLatLng: { lat, lng } }));
  },

  myDirection: RIGHT,
  setMyDirection(direction) {
    set(() => ({ myDirection: direction }));
  },
});
