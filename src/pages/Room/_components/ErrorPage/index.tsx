import { ComponentType, useEffect } from 'react';
import { type FallbackProps } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';

import SurpriseDove from '@/assets/svgs/surprise-dove.svg?react';

import { AxiosError } from 'axios';

import { RESPONSE_CODE } from '@/constants/api';

export const ErrorPage: ComponentType<FallbackProps> = ({ error }) => {
  const navigate = useNavigate();

  const { roomId } = useParams();

  const message = (() => {
    if (!(error instanceof AxiosError)) {
      return '클라이언트 에러 발생';
    }

    return (error as AxiosError<ResponseTemplate<unknown>>).response?.data.message;
  })();

  const code = (() => {
    if (!(error instanceof AxiosError)) {
      return undefined;
    }

    return (error as AxiosError<ResponseTemplate<unknown>>).response?.data.code;
  })();

  useEffect(() => {
    switch (code) {
      case RESPONSE_CODE.NOT_AUTHORITY:
        if (roomId) {
          localStorage.removeItem(roomId);
        }

        break;
    }
  }, [code, roomId]);

  const handleGoHomeButtonClick = () => {
    navigate('/');
  };

  return (
    <div className="flex size-full flex-col items-center justify-center gap-8">
      <SurpriseDove className="w-1/4" />

      <p>{message}</p>

      <div className="cursor-pointer border bg-black p-3" onClick={handleGoHomeButtonClick}>
        <p className="text-sm text-white">홈으로 이동</p>
      </div>
    </div>
  );
};
