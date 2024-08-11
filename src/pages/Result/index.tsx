import { useContext } from 'react';

import { plugins, Preprocessing } from '@/components/Preprocessing';
import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';

import { MutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';

function Result() {
  return (
    <Preprocessing
      plugins={[
        plugins.CheckRoomId,
        plugins.CheckRoomId.LoadImmutableRoomData,
        plugins.CheckRoomId.LoadMutableRoomData,
      ]}
    >
      <ResultService />
    </Preprocessing>
  );
}

function ResultService() {
  const roomId = useContext(RoomIdContext);

  const { restaurants, endTime } = useContext(ImmutableRoomInfoContext);

  const { user } = useContext(MutableRoomInfoContext);

  return (
    <div className="size-full">
      <p>비둘기들의 선택은?</p>

      {endTime > Date.now() ? (
        <div>
          <p>아직 종료되지 않았습니다.</p>
        </div>
      ) : (
        <div>
          <p>결과 출력</p>
        </div>
      )}
    </div>
  );
}

export default Result;
