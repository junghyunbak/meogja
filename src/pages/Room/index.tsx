import { Suspense } from 'react';

import { Loading } from './_components/Loading';
import { CheckUserId } from './_components/CheckUserId';
import { CheckRoomId } from './_components/CheckRoomId';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadImmutableRoomData } from './_components/LoadImmutableRoomData';
import { DelayForAnimation } from './_components/DelayForAnimation';

export function Room() {
  return (
    <ErrorBoundary
      FallbackComponent={(e) => {
        return <div>{JSON.stringify(e.error, null, 2)}</div>;
      }}
    >
      <Suspense fallback={<Loading />}>
        <CheckRoomId>
          <CheckUserId>
            <LoadImmutableRoomData>
              <DelayForAnimation delay={500}>
                <div>메인서비스!</div>
              </DelayForAnimation>
            </LoadImmutableRoomData>
          </CheckUserId>
        </CheckRoomId>
      </Suspense>
    </ErrorBoundary>
  );
}
