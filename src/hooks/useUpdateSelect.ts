import useStore from '@/store';
import { useMutation } from 'react-query';
import axios, { type AxiosError } from 'axios';

export function useUpdateSelect({ userId, roomId }: { roomId: string; userId: string }) {
  const [isUpdatingRef] = useStore((state) => [state.isUpdatingRef]);

  const updateMySelectMutation = useMutation<undefined, AxiosError, RestaurantId>({
    mutationKey: [],
    mutationFn: async (restaurantId) => {
      if (isUpdatingRef) {
        isUpdatingRef.current = true;
      }

      await axios.patch('/api/update-user-select', {
        userId,
        roomId,
        restaurantId,
      });
    },
    onSuccess() {
      if (isUpdatingRef) {
        isUpdatingRef.current = false;
      }
    },
    onError() {
      if (isUpdatingRef) {
        isUpdatingRef.current = false;
      }
    },
  });

  return { updateMySelectMutation };
}
