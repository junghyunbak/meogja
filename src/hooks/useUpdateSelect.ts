import { useMutation } from 'react-query';
import axios, { type AxiosError } from 'axios';
import { useMutationTimeContext } from '@/pages/Room/RoomService/_components/MutationTimeProvider/index.context';

export function useUpdateSelect({ userId, roomId }: { roomId: string; userId: string }) {
  const mutationTime = useMutationTimeContext();

  const updateMySelectMutation = useMutation<undefined, AxiosError, RestaurantId>({
    mutationKey: [],
    mutationFn: async (restaurantId) => {
      mutationTime.current = Date.now();

      await axios.patch('/api/update-user-select', {
        userId,
        roomId,
        restaurantId,
      });
    },
  });

  return { updateMySelectMutation };
}
