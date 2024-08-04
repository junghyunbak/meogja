import { useMutation } from 'react-query';
import { type AxiosError } from 'axios';
import useStore from '@/store';
import axios from 'axios';

export function useUpdateUserName(roomId: string, userId: string) {
  const [setMyName] = useStore((state) => [state.setMyName]);

  const [isUpdatingRef] = useStore((state) => [state.isUpdatingRef]);

  const updateUserNameMutation = useMutation<UserName, AxiosError, UserName>({
    mutationFn: async (newName) => {
      if (isUpdatingRef) {
        isUpdatingRef.current = true;
      }

      const {
        data: {
          data: { userName },
        },
      } = await axios.patch<ResponseTemplate<{ userName: string }>>(
        '/api/update-username',
        {
          newName,
          userId,
          roomId,
        }
      );

      return userName;
    },
    onSuccess(updatedName) {
      setMyName(updatedName);

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

  return { updateUserNameMutation };
}
