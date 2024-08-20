import React, { createContext, useRef } from 'react';
import { create, type UseBoundStore, type StoreApi } from 'zustand';

interface MutableRoomInfoState {
  user: User;
  setUser: (props: User | ((prev: User) => User)) => void;
}

type MutableRoomInfoStore = UseBoundStore<StoreApi<MutableRoomInfoState>>;

export const MutableRoomInfoStoreContext = createContext<MutableRoomInfoStore>({} as MutableRoomInfoStore);

interface MutableRoomInfoContextProviderProps {
  children: React.ReactNode;
  initialState: User;
}

export function MutableRoomInfoStoreContextProvider({ children, initialState }: MutableRoomInfoContextProviderProps) {
  const store = useRef(
    create<MutableRoomInfoState>()((set) => ({
      user: initialState,
      setUser: (param) => {
        if (param instanceof Function) {
          const fn = param;

          set((s) => ({ user: fn(s.user) }));

          return;
        }

        const user = param;

        set(() => ({ user }));
      },
    }))
  ).current;

  return <MutableRoomInfoStoreContext.Provider value={store}>{children}</MutableRoomInfoStoreContext.Provider>;
}
