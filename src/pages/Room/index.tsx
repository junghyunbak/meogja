import { ErrorBoundary } from 'react-error-boundary';
import { ErrorPage } from './_components/ErrorPage';
import { MutationTimeProvider } from './RoomService/_components/MutationTimeProvider';

import { RoomService } from './RoomService';
import { plugins, Preprocessing } from '@/components/Preprocessing';

export function Room() {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <MutationTimeProvider>
        <Preprocessing
          plugins={[
            plugins.LoadNaverMap,
            plugins.CheckRoomId,
            plugins.CheckRoomId.CheckUserId,
            plugins.CheckRoomId.LoadImmutableRoomData,
          ]}
        >
          <RoomService />
        </Preprocessing>
      </MutationTimeProvider>
    </ErrorBoundary>
  );
}

export default Room;
