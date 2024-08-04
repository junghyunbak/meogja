import useStore from '@/store';
import { useEffect } from 'react';

export function Geolocation() {
  const [setMyLatLng] = useStore((state) => [state.setMyLatLng]);

  useEffect(() => {
    const getMyLatLng = (): Promise<{ lat: number; lng: number }> => {
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const {
              coords: { latitude, longitude },
            } = position;

            resolve({ lat: latitude, lng: longitude });
          });
        }
      });
    };

    const updateMyLatLng = async () => {
      try {
        const { lat, lng } = await getMyLatLng();

        setMyLatLng(lat, lng);
      } catch (e) {
        /**
         * Promise의 잘못된 사용으로 에러가 발생할 수 있겠다고 판단되어 try-catch문 사용
         *
         * [ ]: Promise 코드 개선
         */
      }
    };

    updateMyLatLng();

    const timer = setInterval(updateMyLatLng, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <div />;
}
