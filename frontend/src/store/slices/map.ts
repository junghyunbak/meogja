import { type StateCreator } from 'zustand';

// [ ]: map 제거, showOnlyEaten 상태 다른 slice로 이동
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
