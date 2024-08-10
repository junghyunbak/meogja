import React, { Suspense, useMemo } from 'react';
import { LoadNaverMap } from './plugins';
import { useQuery } from 'react-query';
import { sleep } from '@/utils';
import { create } from 'zustand';

import './index.css';

/**
 * 지역 상태를 사용할 경우,
 *
 * "Warning: Can't perform a React state update on a component that hasn't mounted yet."
 *
 * 에러가 발생하기 때문에 전역 상태를 사용
 */
interface StepState {
  step: number;
  setStep: (step: number) => void;
}

const useStepStore = create<StepState>()((set) => ({
  step: 0,
  setStep: (step: number) => set(() => ({ step })),
}));

export type Plugin = (props: {
  children: React.ReactNode;
  step: number;
  setStep: (step: number) => void;
  time: number;
}) => React.ReactNode;

interface PreprocessingProps {
  plugins?: Plugin[];
  children?: React.ReactNode;
}

export function Preprocessing({ plugins = [], children }: PreprocessingProps) {
  const [setStep] = useStepStore((s) => [s.setStep]);

  const time = useMemo(() => {
    return Date.now();
  }, []);

  return (
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
  );
}

interface LoadingProps {
  maxStep: number;
}

function Loading({ maxStep }: LoadingProps) {
  const [step] = useStepStore((s) => [s.step]);

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
  LoadNaverMap: LoadNaverMap,
};
