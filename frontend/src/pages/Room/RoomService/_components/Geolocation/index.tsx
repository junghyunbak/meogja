import useStore from '@/store';
import { useContext, useEffect } from 'react';
import { getMyLatLng } from '@/utils';
import { useMutation } from 'react-query';
import axios, { AxiosResponse, type AxiosError } from 'axios';
import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';

export function Geolocation() {
  const roomId = useContext(RoomIdContext);
  const userId = useContext(UserIdContext);

  const [setMyGpsLatLng] = useStore((state) => [state.setMyGpsLatLng]);

  const updateUserGpsLatLngMutation = useMutation<undefined, AxiosError, { lat: number; lng: number }>({
    mutationKey: [],
    mutationFn: async ({ lat, lng }) => {
      await axios.patch<
        ResponseTemplate<object>,
        AxiosResponse<ResponseTemplate<object>>,
        { lat: number; lng: number; roomId: string; userId: string }
      >('/api/update-user-gps-lat-lng', { lat, lng, roomId, userId });
    },
  });

  useEffect(() => {
    const updateMyLatLng = async () => {
      const latLng = await getMyLatLng();

      if (!latLng) {
        return;
      }

      setMyGpsLatLng(latLng);
      updateUserGpsLatLngMutation.mutate(latLng);
    };

    updateMyLatLng();

    const timer = setInterval(updateMyLatLng, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [setMyGpsLatLng]);

  return null;
}
