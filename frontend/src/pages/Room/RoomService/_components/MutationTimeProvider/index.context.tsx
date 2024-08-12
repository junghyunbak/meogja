import React from 'react';

function createContext<T>() {
  const context = React.createContext<T | null>(null);

  const useContext = () => {
    const value = React.useContext(context);

    if (value === null) {
      throw new Error();
    }

    return value;
  };

  return [useContext, context.Provider] as const;
}

type MutationTimeContxtType = React.MutableRefObject<number>;

export const [useMutationTimeContext, MutationTimeContextProvider] = createContext<MutationTimeContxtType>();
