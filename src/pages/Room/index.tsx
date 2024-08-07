import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Loading } from './_components/Loading';
import { CheckUserId } from './_components/CheckUserId';
import { CheckRoomId } from './_components/CheckRoomId';
import { LoadImmutableRoomData } from './_components/LoadImmutableRoomData';
import { DelayForAnimation } from './_components/DelayForAnimation';
import { ErrorPage } from './_components/ErrorPage';
import { RoomService } from './RoomService';

export function Room() {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <Suspense fallback={<Loading />}>
        <CheckRoomId>
          <CheckUserId>
            <LoadImmutableRoomData>
              <DelayForAnimation delay={500}>
                <RoomService />
              </DelayForAnimation>
            </LoadImmutableRoomData>
          </CheckUserId>
        </CheckRoomId>
      </Suspense>
    </ErrorBoundary>
  );
}
