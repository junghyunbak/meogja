import { useMutation } from 'react-query';

import { useMutationTimeContext } from '@/pages/Room/_components/MutationTimeProvider/index.context';

import axios, { type AxiosError } from 'axios';

export function useUpdateUserMapLatLng(roomId: string, userId: string) {
  const mutationTime = useMutationTimeContext();

  const updateUserMapLatLngMutation = useMutation<
    undefined,
    AxiosError,
    { lat: number; lng: number; direction: LEFT | RIGHT }
  >({
    mutationKey: [],
    mutationFn: async ({ lat, lng, direction }) => {
      mutationTime.current = Date.now();

      await axios.patch('/api/update-user-lat-lng', {
        roomId,
        userId,
        lat,
        lng,
        direction,
      });
    },
  });

  return updateUserMapLatLngMutation;
}
