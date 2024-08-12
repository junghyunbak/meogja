import { useContext } from 'react';
import { useQuery } from 'react-query';

import axios from 'axios';

import { RoomIdContext } from '../CheckRoomId/index.context';
import { ImmutableRoomInfoContextProvider } from './index.context';

import { type Plugin } from '../..';

export const LoadImmutableRoomData: Plugin = ({ children, time, step, setStep }) => {
  const roomId = useContext(RoomIdContext);

  const { data, isLoading } = useQuery({
    queryKey: ['load-immutable-room-data', time],
    queryFn: async () => {
      const response = await axios
        .get<ResponseTemplate<ImmutableRoomInfo>>('/api/immutable-room-state', { params: { roomId } })
        .then((value) => value.data);

      return response.data;
    },
    onSuccess() {
      setStep(step);
    },
    suspense: true,
    useErrorBoundary: true,
  });

  if (isLoading || !data) {
    return null;
  }

  return <ImmutableRoomInfoContextProvider value={data}>{children}</ImmutableRoomInfoContextProvider>;
};
