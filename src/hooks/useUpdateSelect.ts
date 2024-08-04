import useStore from '@/store';
import { useMutation } from 'react-query';
import axios from 'axios';

export function useUpdateSelect(
  roomId: string,
  userId: string,
  restaurantId: string
) {
  const [isUpdatingRef] = useStore((state) => [state.isUpdatingRef]);

  const updateMySelectMutation = useMutation({
    mutationKey: [],
    mutationFn: async () => {
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
