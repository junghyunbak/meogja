import React, { createContext } from 'react';

type ImmutableRoomInfoContextValue = ImmutableRoomInfo;

export const ImmutableRoomInfoContext = createContext<ImmutableRoomInfoContextValue>(
  {} as ImmutableRoomInfoContextValue
);

interface ImmutableRoomInfoContextProviderProps {
  children: React.ReactNode;
  value: ImmutableRoomInfoContextValue;
}

export function ImmutableRoomInfoContextProvider({ children, value }: ImmutableRoomInfoContextProviderProps) {
  return <ImmutableRoomInfoContext.Provider value={value}>{children}</ImmutableRoomInfoContext.Provider>;
}
