import { MutationTimeProvider } from './_components/MutationTimeProvider';
import { RoomService } from './RoomService';
import { plugins, Preprocessing } from '@/components/Preprocessing';

export function Room() {
  return (
    <MutationTimeProvider>
      <Preprocessing
        plugins={[
          plugins.LoadNaverMap,
          plugins.CheckRoomId,
          plugins.CheckRoomId.CheckUserId,
          plugins.CheckRoomId.LoadImmutableRoomData,
        ]}
        loadingMessage="방에 입장 중"
      >
        <RoomService />
      </Preprocessing>
    </MutationTimeProvider>
  );
}

export default Room;
