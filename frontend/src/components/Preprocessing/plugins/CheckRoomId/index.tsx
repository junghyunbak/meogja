import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { type Plugin } from '../..';

import axios from 'axios';

import { RoomIdContextProvider } from './index.context';

export const CheckRoomId: Plugin = ({ children, setStep, step, time }) => {
  const { roomId } = useParams();

  const { isLoading } = useQuery({
    queryKey: ['check-room-id', time],
    queryFn: async () => {
      await axios.get('/api/check-room', { params: { roomId } });
    },
    onSuccess() {
      setStep(step);
    },
    suspense: true,
    useErrorBoundary: true,
  });

  if (isLoading || !roomId) {
    return null;
  }

  return <RoomIdContextProvider value={roomId}>{children}</RoomIdContextProvider>;
};
