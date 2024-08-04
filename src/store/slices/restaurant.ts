import { type StateCreator } from 'zustand';

type RestaurantSlice = {
  // [ ]: 현재 선택된 음식점 id로 네이밍 변경 필요
  restaurantId: string | null;
  setRestaurantId: (restaurantId: string | null) => void;
};

export const createRestaurantSlice: StateCreator<RestaurantSlice> = (
  set
): RestaurantSlice => ({
  restaurantId: null,
  setRestaurantId: (restaurantId: string | null) => {
    set(() => ({ restaurantId }));
  },
});
