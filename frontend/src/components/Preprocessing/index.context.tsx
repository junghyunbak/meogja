import React, { useRef, createContext } from 'react';

import { create, type StoreApi, type UseBoundStore } from 'zustand';

/**
 * 지역 상태를 사용할 경우,
 *
 * "Warning: Can't perform a React state update on a component that hasn't mounted yet."
 *
 * 에러가 발생하기 때문에 전역 상태를 사용
 */
export interface StepState {
  step: number;
  setStep: (step: number) => void;
}

type StepStore = UseBoundStore<StoreApi<StepState>>;

export const StepStoreContext = createContext<StepStore>({} as StepStore);

interface StepStoreProviderProps {
  children: React.ReactNode;
}

export function StepStoreProvider({ children }: StepStoreProviderProps) {
  const store = useRef(
    create<StepState>()((set) => ({ step: 0, setStep: (step: number) => set(() => ({ step })) }))
  ).current;

  return <StepStoreContext.Provider value={store}>{children}</StepStoreContext.Provider>;
}
