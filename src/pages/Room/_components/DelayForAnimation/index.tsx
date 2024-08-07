import React from 'react';
import { useQuery } from 'react-query';

import { sleep } from '@/utils';

interface DelayForAnimationProps {
  children: React.ReactNode;

  /**
   * 단위: ms
   */
  delay?: number;
}

export function DelayForAnimation({ children, delay = 1000 }: DelayForAnimationProps) {
  const { isLoading } = useQuery({
    queryKey: ['delay-for-animation'],
    queryFn: async () => {
      await sleep(delay);
    },
    suspense: true,
  });

  if (isLoading) {
    return null;
  }

  return children;
}
