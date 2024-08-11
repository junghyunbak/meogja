import React, { createContext, Suspense, useContext, useMemo, useRef } from 'react';
import { CheckRoomId, CheckUserId, LoadImmutableRoomData, LoadMutableRoomData, LoadNaverMap } from './plugins';
import { useQuery } from 'react-query';
import { sleep } from '@/utils';
import { create, StoreApi, UseBoundStore, useStore } from 'zustand';

import './index.css';

export type Plugin = (props: {
  children: React.ReactNode;
  step: number;
  setStep: (step: number) => void;
  time: number;
}) => React.ReactNode;

/**
 * 지역 상태를 사용할 경우,
 *
 * "Warning: Can't perform a React state update on a component that hasn't mounted yet."
 *
 * 에러가 발생하기 때문에 전역 상태를 지역 상태처럼 사용
 */
interface StepState {
  step: number;
  setStep: (step: number) => void;
}

type StepStore = UseBoundStore<StoreApi<StepState>>;

const StepStoreContext = createContext<StepStore>({} as StepStore);

interface PreprocessingProps {
  plugins?: Plugin[];
  children?: React.ReactNode;
}

export function Preprocessing({ plugins = [], children }: PreprocessingProps) {
  const store = useRef(
    create<StepState>()((set) => ({ step: 0, setStep: (step: number) => set(() => ({ step })) }))
  ).current;

  const [setStep] = useStore(store, (s) => [s.setStep]);

  const time = useMemo(() => {
    return Date.now();
  }, []);

  return (
    <StepStoreContext.Provider value={store}>
      <Suspense fallback={<Loading maxStep={plugins.length} />}>
        {[...plugins, Finish]
          .map((value, i) => ({ Component: value, step: i + 1 }))
          .reverse()
          .reduce((result, { Component, step }) => {
            return (
              <Component step={step} setStep={setStep} time={time}>
                {result}
              </Component>
            );
          }, children)}
      </Suspense>
    </StepStoreContext.Provider>
  );
}

interface LoadingProps {
  maxStep: number;
}

function Loading({ maxStep }: LoadingProps) {
  const store = useContext(StepStoreContext);

  const [step] = useStore(store, (s) => [s.step]);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <p className="text-2xl">
        로딩중
        {Array(step)
          .fill(null)
          .map(() => '.')}
      </p>
      <div className="loading-bar">
        <div style={{ width: `${Math.floor((step / maxStep) * 100)}%` }} />
      </div>
    </div>
  );
}

const Finish: Plugin = ({ children, setStep, time }) => {
  const { isLoading } = useQuery({
    queryKey: ['delay-for-animation', time],
    queryFn: async () => {
      /**
       * 애니메이션을 위한 delay (0.5s)
       */
      await sleep(500);
    },
    suspense: true,
    onSuccess() {
      /**
       * step 0단계로 상태 리셋
       */
      setStep(0);
    },
  });

  if (isLoading) {
    return null;
  }

  return children;
};

export const plugins = {
  LoadNaverMap,
  CheckRoomId: Object.assign(CheckRoomId, {
    CheckUserId,
    LoadImmutableRoomData,
    LoadMutableRoomData,
  }),
};
