import { type StateCreator } from 'zustand';

type RestaurantSlice = {
  restaurantId: string | null;
  setRestaurantId: (restaurantId: string) => void;
};

export const createRestaurantSlice: StateCreator<RestaurantSlice> = (
  set
): RestaurantSlice => ({
  restaurantId: null,
  setRestaurantId: (restaurantId: string | null) => {
    set(() => ({ restaurantId }));
  },
});
