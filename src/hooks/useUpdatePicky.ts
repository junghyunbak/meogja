import useStore from '@/store';
import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';

export function useUpdatePicky({ roomId, userId }: { roomId: string; userId: string }) {
  const [isUpdatingRef] = useStore((state) => [state.isUpdatingRef]);

  const updateMyPickyMutation = useMutation<undefined, AxiosError, RestaurantId>({
    mutationKey: [],
    mutationFn: async (restaurantId: RestaurantId) => {
      if (isUpdatingRef) {
        isUpdatingRef.current = true;
      }

      await axios.patch('/api/update-user-picky', {
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

  return { updateMyPickyMutation };
}
