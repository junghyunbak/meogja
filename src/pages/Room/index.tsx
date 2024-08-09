import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { LoadingPage } from './_components/LoadingPage';
import { CheckUserId } from './_components/CheckUserId';
import { CheckRoomId } from './_components/CheckRoomId';
import { LoadImmutableRoomData } from './_components/LoadImmutableRoomData';
import { DelayForAnimation } from './_components/DelayForAnimation';
import { ErrorPage } from './_components/ErrorPage';
import { RoomService } from './RoomService';
import { MutationTimeProvider } from './RoomService/_components/MutationTimeProvider';
import { LoadNaverMapScript } from './_components/LoadNaverMapScript';

export function Room() {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <MutationTimeProvider>
        <Suspense fallback={<LoadingPage />}>
          <LoadNaverMapScript>
            <CheckRoomId>
              <CheckUserId>
                <LoadImmutableRoomData>
                  <DelayForAnimation delay={500}>
                    <RoomService />
                  </DelayForAnimation>
                </LoadImmutableRoomData>
              </CheckUserId>
            </CheckRoomId>
          </LoadNaverMapScript>
        </Suspense>
      </MutationTimeProvider>
    </ErrorBoundary>
  );
}
