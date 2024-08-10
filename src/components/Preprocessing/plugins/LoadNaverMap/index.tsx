import { useQuery } from 'react-query';
import { type Plugin } from '../..';

// [ ]: 환경변수로 이동
const NCP_CLIENT_ID = 'whcqgikkmk';

export const LoadNaverMap: Plugin = ({ children, step, setStep, time }) => {
  const { isLoading } = useQuery({
    queryKey: ['load-naver-map-script', time],
    queryFn: async () => {
      console.log('한번만 실행');

      const src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NCP_CLIENT_ID}`;

      if (document.querySelector(`[src="${src}"]`)) {
        return;
      }

      const script = document.createElement('script');

      script.src = src;
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
      setStep(step);
    },
    suspense: true,
    useErrorBoundary: true,
  });

  if (isLoading) {
    return null;
  }

  return children;
};
