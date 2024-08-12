import { useMutation } from 'react-query';
import useStore from '@/store';
import axios from 'axios';
import React from 'react';
import { useMutationTimeContext } from '@/pages/Room/RoomService/_components/MutationTimeProvider/index.context';

export function useUpdateUserName(
  roomId: string,
  userId: string,
  setName: React.Dispatch<React.SetStateAction<string>>
) {
  const [myName] = useStore((state) => [state.myName]);

  const mutationTime = useMutationTimeContext();

  const updateUserNameMutation = useMutation({
    mutationFn: async (newName) => {
      mutationTime.current = Date.now();

      await axios.patch('/api/update-username', {
        newName,
        userId,
        roomId,
      });
    },
    onError() {
      setName(myName);
    },
  });

  return { updateUserNameMutation };
}
