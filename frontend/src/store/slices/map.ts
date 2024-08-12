import { type StateCreator } from 'zustand';

type MapSlice = {
  map: naver.maps.Map | null;
  setMap: (map: naver.maps.Map | null) => void;

  showOnlyEaten: boolean;
  setShowOnlyEaten: (showOnlyEaten: boolean) => void;
};

export const createMapSlice: StateCreator<MapSlice> = (set): MapSlice => ({
  map: null,
  setMap(map) {
    set(() => ({ map }));
  },

  showOnlyEaten: false,
  setShowOnlyEaten(showOnlyEaten) {
    set(() => ({ showOnlyEaten }));
  },
});
