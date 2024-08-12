import React, { createContext } from 'react';

type RoomIdContextValue = RoomId;

export const RoomIdContext = createContext<RoomIdContextValue>('');

interface RoomIdContextProviderProps {
  children: React.ReactNode;
  value: RoomIdContextValue;
}

export function RoomIdContextProvider({ children, value }: RoomIdContextProviderProps) {
  return <RoomIdContext.Provider value={value}>{children}</RoomIdContext.Provider>;
}
