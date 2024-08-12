import { useRef } from 'react';
import { MutationTimeContextProvider } from './index.context';

interface MutationTimeProviderProps {
  children: React.ReactNode;
}

export function MutationTimeProvider({ children }: MutationTimeProviderProps) {
  const mutationTime = useRef(0);

  return <MutationTimeContextProvider value={mutationTime}>{children}</MutationTimeContextProvider>;
}
