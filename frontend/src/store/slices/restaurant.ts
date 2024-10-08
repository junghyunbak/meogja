import { type StateCreator } from 'zustand';

type RestaurantSlice = {
  currentRestaurantId: string | null;
  setCurrentRestaurantId: (restaurantId: string | null) => void;

  currentCategory: string | null;
  setCurrentCategory: (category: string | null) => void;

  showOnlyEaten: boolean;
  setShowOnlyEaten: (showOnlyEaten: boolean) => void;
};

export const createRestaurantSlice: StateCreator<RestaurantSlice> = (set): RestaurantSlice => ({
  currentRestaurantId: null,
  setCurrentRestaurantId: (restaurantId: string | null) => {
    set(() => ({ currentRestaurantId: restaurantId }));
  },

  currentCategory: null,
  setCurrentCategory: (category: string | null) => {
    set(() => ({ currentCategory: category }));
  },

  showOnlyEaten: false,
  setShowOnlyEaten(showOnlyEaten) {
    set(() => ({ showOnlyEaten }));
  },
});
