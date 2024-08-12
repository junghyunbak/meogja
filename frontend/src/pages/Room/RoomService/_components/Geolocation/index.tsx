import useStore from '@/store';
import { useEffect } from 'react';
import { getMyLatLng } from '@/utils';

export function Geolocation() {
  const [setMyGpsLatLng] = useStore((state) => [state.setMyGpsLatLng]);

  useEffect(() => {
    const updateMyLatLng = async () => {
      setMyGpsLatLng(await getMyLatLng());
    };

    updateMyLatLng();

    const timer = setInterval(updateMyLatLng, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [setMyGpsLatLng]);

  return null;
}
