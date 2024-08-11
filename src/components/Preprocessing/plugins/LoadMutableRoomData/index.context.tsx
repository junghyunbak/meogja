import React, { createContext } from 'react';

type MutableRoomInfoContextValue = MutableRoomInfo;

export const MutableRoomInfoContext = createContext<MutableRoomInfoContextValue>({} as MutableRoomInfoContextValue);

interface MutableRoomInfoContextProviderProps {
  children: React.ReactNode;
  value: MutableRoomInfoContextValue;
}

export function MutableRoomInfoContextProvider({ children, value }: MutableRoomInfoContextProviderProps) {
  return <MutableRoomInfoContext.Provider value={value}>{children}</MutableRoomInfoContext.Provider>;
}
