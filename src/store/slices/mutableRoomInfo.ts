import { type StateCreator } from 'zustand';

type MutableRoomInfoSlice = {
  user: User;
  setUser: (user: User) => void;
};

export const createMutableRoomInfoSlice: StateCreator<MutableRoomInfoSlice> = (
  set
): MutableRoomInfoSlice => ({
  user: {},
  setUser: (user: User) => {
    set(() => ({ user }));
  },
});
