import { useRef, useState } from 'react';
import { plugins, Preprocessing } from '@/components/Preprocessing';

import { Map } from './_components/Map';
import { Counter } from './_components/Counter';
import { Category } from './_components/Category';

export const defaultValue = {
  /**
   * kakao
   */
  lat: 33.450701,
  lng: 126.570667,
  maxRoomJoinCount: 4,
  maxChooseCount: 3,
  limitMinute: 5,

  /**
   * 단위: kilometer
   */
  activityRadius: 1,
};

export type FormData = {
  maxRoomJoinCount: number;
  maxChooseCount: number;
  limitMinute: number;
  /**
   * 단위: kilometer
   */
  activityRadius: number;
  lat: number;
  lng: number;
  category: 'FD' | 'CE';
};

export type FormCounterData = Pick<FormData, 'activityRadius' | 'limitMinute' | 'maxChooseCount' | 'maxRoomJoinCount'>;

function CreateRoom() {
  const formData = useRef<FormData>({
    maxRoomJoinCount: defaultValue.maxRoomJoinCount,
    maxChooseCount: defaultValue.maxChooseCount,
    limitMinute: defaultValue.limitMinute,
    activityRadius: defaultValue.activityRadius,
    lat: defaultValue.lat,
    lng: defaultValue.lng,
    category: 'FD',
  });

  const updateLatLng = (lat: number, lng: number) => {
    formData.current.lat = lat;
    formData.current.lng = lng;
  };

  const updateFormCounter = (value: number, key: keyof FormCounterData) => {
    formData.current[key] = value;
  };

  const updateCategory = (category: FormData['category']) => {
    formData.current.category = category;
  };

  const [activityRadius, setActivityRadius] = useState(defaultValue.activityRadius);

  return (
    <div className="flex min-h-full w-full flex-col bg-p-yg p-6">
      <p className="mb-6 text-center text-2xl">어디로 이동할까?</p>

      <div className="flex w-full flex-col items-center border border-black bg-white py-4">
        <div className="mb-3 w-full">
          <Counter
            title="방 최대인원"
            unit="명"
            min={2}
            max={10}
            counterKey="maxRoomJoinCount"
            updateFormCounter={updateFormCounter}
            initialCounterNumber={defaultValue.maxRoomJoinCount}
          />
        </div>

        <div className="mb-3 w-full">
          <Counter
            title="제한 시간"
            unit="분"
            min={3}
            max={10}
            counterKey="limitMinute"
            updateFormCounter={updateFormCounter}
            initialCounterNumber={defaultValue.limitMinute}
          />
        </div>

        <hr className="w-full border-black" />

        <div className="w-full bg-p-pink p-3">
          <p className="text-center text-base">목적</p>
        </div>

        <hr className="w-full border-black" />

        <Category updateCategory={updateCategory} />

        <hr className="w-full border-black" />

        <div className="mb-3 w-full">
          <Counter
            title="최대 선택 수"
            unit="개"
            min={3}
            max={5}
            counterKey="maxChooseCount"
            updateFormCounter={updateFormCounter}
            initialCounterNumber={defaultValue.maxChooseCount}
          />
        </div>

        <hr className="w-full border-black" />

        <div className="w-full bg-p-pink p-3">
          <p className="text-center text-base">모일 장소</p>
        </div>

        <hr className="w-full border-black" />

        <div className="aspect-[3/2] w-full">
          <Preprocessing plugins={[plugins.LoadNaverMap]}>
            <Map updateLatLng={updateLatLng} radius={activityRadius} />
          </Preprocessing>
        </div>

        <hr className="w-full border-black" />

        <div className="mb-3 w-full">
          <Counter
            title="활동 반경"
            unit="km"
            min={1}
            max={3}
            counterKey="activityRadius"
            updateFormCounter={updateFormCounter}
            number={activityRadius}
            setNumber={setActivityRadius}
          />
        </div>

        <div
          className="w-fit bg-black p-3"
          onClick={() => {
            console.log(formData.current);
          }}
        >
          <p className="text-white">방 생성하기</p>
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;
