import React, { Suspense, useContext, useMemo } from 'react';
import { useQuery } from 'react-query';

import { CheckRoomId, CheckUserId, LoadImmutableRoomData, LoadMutableRoomData, LoadNaverMap } from './plugins';

import { sleep } from '@/utils';

import { useStore } from 'zustand';

import { StepStoreContext, StepStoreProvider } from './index.context';

import './index.css';

export type Plugin = (props: {
  children: React.ReactNode;
  step: number;
  setStep: (step: number) => void;
  time: number;
}) => React.ReactNode;

interface PreprocessingProps {
  plugins?: Plugin[];
  children?: React.ReactNode;
  loadingMessage?: string;
}

export function Preprocessing({ plugins = [], children, loadingMessage = '로딩중' }: PreprocessingProps) {
  const time = useMemo(() => {
    return Date.now();
  }, []);

  return (
    <StepStoreProvider>
      <Suspense fallback={<Loading maxStep={plugins.length} message={loadingMessage} />}>
        <Pipe plugins={plugins} time={time} target={children} />
      </Suspense>
    </StepStoreProvider>
  );
}

interface PipeProps {
  plugins: Plugin[];
  time: number;
  target: React.ReactNode;
}

function Pipe({ plugins, time, target }: PipeProps) {
  const [setStep] = useStore(useContext(StepStoreContext), (s) => [s.setStep]);

  return (
    <>
      {[...plugins, DelayForAnimation]
        .map((Component, i) => ({ Component, step: i + 1 }))
        .reverse()
        .reduce((result, { Component, step }) => {
          return (
            <Component step={step} setStep={setStep} time={time}>
              {result}
            </Component>
          );
        }, target)}
    </>
  );
}

interface LoadingProps {
  maxStep: number;
  message: string;
}

function Loading({ maxStep, message }: LoadingProps) {
  const store = useContext(StepStoreContext);

  const [step] = useStore(store, (s) => [s.step]);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <p className="text-2xl">
        {message}
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

const DelayForAnimation: Plugin = ({ children, time }) => {
  const { isLoading } = useQuery({
    queryKey: ['delay-for-animation', time],
    queryFn: async () => {
      /**
       * 애니메이션을 위한 delay (0.5s)
       */
      await sleep(500);
    },
    suspense: true,
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
