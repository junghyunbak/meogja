import { type StateCreator } from 'zustand';

type MapSlice = {
  map: naver.maps.Map | null;
  setMap: (map: naver.maps.Map | null) => void;
};

export const createMapSlice: StateCreator<MapSlice> = (set): MapSlice => ({
  map: null,
  setMap: (map: naver.maps.Map | null) => {
    set(() => ({ map }));
  },
});
