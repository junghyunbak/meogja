import React from 'react';
import { useQuery } from 'react-query';

import useStore from '@/store';

import { sleep } from '@/utils';

interface DelayForAnimationProps {
  children: React.ReactNode;

  /**
   * 단위: ms
   */
  delay?: number;
}

export function DelayForAnimation({ children, delay = 1000 }: DelayForAnimationProps) {
  const [setGage] = useStore((state) => [state.setGage]);

  const { isLoading } = useQuery({
    queryKey: ['delay-for-animation'],
    queryFn: async () => {
      await sleep(delay);
    },
    suspense: true,
    onSuccess() {
      /**
       * 전역 상태가 살아있을것을 대비하여 0단계로 다시 초기화
       */
      setGage(0);
    },
  });

  if (isLoading) {
    return null;
  }

  return children;
}
