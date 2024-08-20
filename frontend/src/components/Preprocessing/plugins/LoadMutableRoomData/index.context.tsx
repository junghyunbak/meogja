import React, { createContext, useRef } from 'react';
import { create, type UseBoundStore, type StoreApi } from 'zustand';

interface MutableRoomInfoState {
  user: User;
  setUser: (user: User) => void;
}

type MutableRoomInfoStore = UseBoundStore<StoreApi<MutableRoomInfoState>>;

export const MutableRoomInfoStoreContext = createContext<MutableRoomInfoStore>({} as MutableRoomInfoStore);

interface MutableRoomInfoContextProviderProps {
  children: React.ReactNode;
  initialState: User;
}

export function MutableRoomInfoStoreContextProvider({ children, initialState }: MutableRoomInfoContextProviderProps) {
  const store = useRef(
    create<MutableRoomInfoState>()((set) => ({ user: initialState, setUser: (user: User) => set(() => ({ user })) }))
  ).current;

  return <MutableRoomInfoStoreContext.Provider value={store}>{children}</MutableRoomInfoStoreContext.Provider>;
}
