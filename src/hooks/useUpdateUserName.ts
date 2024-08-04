import { useMutation } from 'react-query';
import useStore from '@/store';
import axios from 'axios';
import React from 'react';

export function useUpdateUserName(
  roomId: string,
  userId: string,
  setName: React.Dispatch<React.SetStateAction<string>>
) {
  const [myName] = useStore((state) => [state.myName]);

  const [isUpdatingRef] = useStore((state) => [state.isUpdatingRef]);

  const updateUserNameMutation = useMutation({
    mutationFn: async (newName) => {
      if (isUpdatingRef) {
        isUpdatingRef.current = true;
      }

      await axios.patch('/api/update-username', {
        newName,
        userId,
        roomId,
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

      setName(myName);
    },
  });

  return { updateUserNameMutation };
}
