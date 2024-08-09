import useStore from '@/store';
import { useQuery } from 'react-query';

// [ ]: 환경변수로 이동
const NCP_CLIENT_ID = 'whcqgikkmk';

interface LoadNaverMapScriptProps {
  children: React.ReactNode;
}

export function LoadNaverMapScript({ children }: LoadNaverMapScriptProps) {
  const [setGage] = useStore((state) => [state.setGage]);

  const { isLoading } = useQuery({
    queryKey: ['load-naver-map-script'],
    queryFn: async () => {
      const src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NCP_CLIENT_ID}`;

      const script = document.createElement('script');

      script.src = src;
      script.async = true;
      script.type = 'text/javascript';

      document.body.appendChild(script);

      await new Promise<void>((resolve) => {
        const handleScriptLoad = () => {
          resolve();
        };

        script.addEventListener('load', handleScriptLoad);
      });
    },
    onSuccess() {
      setGage(1);
    },
    suspense: true,
    useErrorBoundary: true,
  });

  if (isLoading) {
    return null;
  }

  return children;
}
