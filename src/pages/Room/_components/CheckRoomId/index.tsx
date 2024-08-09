import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import { RoomIdContextProvider } from './index.context';

import useStore from '@/store';

interface CheckRoomProps {
  children: React.ReactNode;
}

export function CheckRoomId({ children }: CheckRoomProps) {
  const { roomId } = useParams();

  const [setGage] = useStore((state) => [state.setGage]);

  const { isLoading } = useQuery({
    queryKey: ['check-room-id'],
    queryFn: async () => {
      await axios.get('/api/check-room', { params: { roomId } });
    },
    onSuccess() {
      setGage(2);
    },
    suspense: true,
    useErrorBoundary: true,
  });

  if (isLoading || !roomId) {
    return null;
  }

  return <RoomIdContextProvider value={roomId}>{children}</RoomIdContextProvider>;
}
