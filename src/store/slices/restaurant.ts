import { type StateCreator } from 'zustand';

type RestaurantSlice = {
  currentRestaurantId: string | null;
  setCurrentRestaurantId: (restaurantId: string | null) => void;
};

export const createRestaurantSlice: StateCreator<RestaurantSlice> = (
  set
): RestaurantSlice => ({
  currentRestaurantId: null,
  setCurrentRestaurantId: (restaurantId: string | null) => {
    set(() => ({ currentRestaurantId: restaurantId }));
  },
});
