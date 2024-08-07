import React, { useContext } from 'react';
import { useQuery } from 'react-query';

import axios from 'axios';

import useStore from '@/store';

import { RoomIdContext } from '../CheckRoomId/index.context';
import { ImmutableRoomInfoContextProvider } from './index.context';

interface LoadImmutableRoomDataProps {
  children: React.ReactNode;
}

export function LoadImmutableRoomData({ children }: LoadImmutableRoomDataProps) {
  const roomId = useContext(RoomIdContext);

  const [setGage] = useStore((state) => [state.setGage]);

  const { data, isLoading } = useQuery({
    queryKey: ['load-immutable-room-data'],
    queryFn: async () => {
      const response = await axios
        .get<ResponseTemplate<ImmutableRoomInfo>>('/api/immutable-room-state', { params: { roomId } })
        .then((value) => value.data);

      return response.data;
    },
    onSuccess() {
      setGage(3);
    },
    suspense: true,
    useErrorBoundary: true,
  });

  if (isLoading || !data) {
    return null;
  }

  return <ImmutableRoomInfoContextProvider value={data}>{children}</ImmutableRoomInfoContextProvider>;
}
