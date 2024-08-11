import { useContext } from 'react';
import { useQuery } from 'react-query';

import axios from 'axios';

import { RoomIdContext } from '../CheckRoomId/index.context';

import { type Plugin } from '../..';

import { MutableRoomInfoContextProvider } from './index.context';

export const LoadMutableRoomData: Plugin = ({ children, time, step, setStep }) => {
  const roomId = useContext(RoomIdContext);

  const { data, isLoading } = useQuery({
    queryKey: ['load-mutable-room-data', time],
    queryFn: async () => {
      const response = await axios
        .get<ResponseTemplate<MutableRoomInfo>>('/api/mutable-room-state', { params: { roomId } })
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

  return <MutableRoomInfoContextProvider value={data}>{children}</MutableRoomInfoContextProvider>;
};
