import { type StateCreator } from 'zustand';

type MyLatLngSlice = {
  myLatLng: { lat: number; lng: number };
  setMyLatLng: (lat: number, lng: number) => void;
};

export const createMyLatLngSlice: StateCreator<MyLatLngSlice> = (
  set
): MyLatLngSlice => ({
  myLatLng: { lat: 0, lng: 0 },
  setMyLatLng: function (lat: number, lng: number) {
    set(() => ({ myLatLng: { lat, lng } }));
  },
});
