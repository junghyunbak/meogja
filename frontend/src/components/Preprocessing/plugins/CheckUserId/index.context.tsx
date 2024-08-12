import React, { createContext } from 'react';

type UserIdContextValue = UserId;

export const UserIdContext = createContext<UserIdContextValue>('');

interface UserIdContextProviderProps {
  children: React.ReactNode;
  value: UserIdContextValue;
}

export function UserIdContextProvider({ children, value }: UserIdContextProviderProps) {
  return <UserIdContext.Provider value={value}>{children}</UserIdContext.Provider>;
}
