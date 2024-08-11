import React, { useEffect, useRef, useState } from 'react';
import { plugins, Preprocessing } from '@/components/Preprocessing';
import { useNaverMap } from '@/hooks/useNaverMap';
import { getMyLatLng } from '@/utils';

const defaultValue = {
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

type FormData = {
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

type FormCounterData = Pick<FormData, 'activityRadius' | 'limitMinute' | 'maxChooseCount' | 'maxRoomJoinCount'>;

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

interface MapProps {
  radius: number;
  updateLatLng: (lat: number, lng: number) => void;
}

function Map({ radius, updateLatLng }: MapProps) {
  const { map } = useNaverMap({
    lat: defaultValue.lat,
    lng: defaultValue.lng,
    mapId: 'create-room-map',
  });

  const [centerLatLng, setCenterLatLng] = useState(new naver.maps.LatLng(defaultValue.lat, defaultValue.lng));

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [circle, setCircle] = useState<naver.maps.Circle | null>(null);
  const [polyline, setPolyline] = useState<naver.maps.Polyline | null>(null);
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  /**
   * circle, polyline, marker 오버레이 생성
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    const handleMapCenterChange = (center: naver.maps.Coord) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        const { x: lng, y: lat } = center;

        setCenterLatLng(new naver.maps.LatLng(lat, lng));

        updateLatLng(lat, lng);
      }, 100);
    };

    const centerChangedEventListener = naver.maps.Event.addListener(map, 'center_changed', handleMapCenterChange);

    const circle = new naver.maps.Circle({
      map,
      center: centerLatLng,
      radius: radius * 1000,
      fillColor: '#000000',
      fillOpacity: 0.05,
      strokeColor: '#000000',
    });

    setCircle(circle);

    const polyline = new naver.maps.Polyline({
      map,
      path: [centerLatLng, centerLatLng.destinationPoint(90, 1000)],
      strokeColor: '#000000',
    });

    setPolyline(polyline);

    const marker = new naver.maps.Marker({
      map,
      icon: {
        content: `<div class="text-xs select-none">${radius}km</div>`,
      },
      position: centerLatLng.destinationPoint(90, 500),
      clickable: false,
    });

    setMarker(marker);

    return () => {
      naver.maps.Event.removeListener(centerChangedEventListener);

      circle.setMap(null);
      polyline.setMap(null);
      marker.setMap(null);
    };
  }, [map]);

  /**
   * 화면 위치가 달라짐에 따라 오버레이 위치 변경
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    if (circle) {
      circle.setRadius(radius * 1000);
      circle.setCenter(centerLatLng);
    }

    if (polyline) {
      polyline.setPath([centerLatLng, centerLatLng.destinationPoint(90, radius * 1000)]);
    }

    if (marker) {
      marker.setIcon({ content: `<div class="text-xs select-none">${radius}km</div>` });
      marker.setPosition(centerLatLng.destinationPoint(90, (radius * 1000) / 2));
    }
  }, [map, circle, polyline, centerLatLng, marker, radius]);

  return (
    <div className="relative size-full">
      <div id="create-room-map" className="size-full" />
      <div
        className="absolute bottom-0 left-0 m-3 cursor-pointer bg-black p-2"
        onClick={async () => {
          if (!map) {
            return;
          }

          const latLng = await getMyLatLng();

          if (!latLng) {
            return;
          }

          map.setCenter(new naver.maps.LatLng(latLng.lat, latLng.lng));
        }}
      >
        <p className="text-sm text-white">내 위치로 이동</p>
      </div>
    </div>
  );
}

type CounterProps = {
  number?: number;
  setNumber?: React.Dispatch<React.SetStateAction<number>>;
  initialCounterNumber?: number;
  title: string;
  unit: string;
  min: number;
  max: number;
  counterKey: keyof FormCounterData;
  updateFormCounter: (value: number, key: keyof FormCounterData) => void;
};

function Counter({ number, setNumber, initialCounterNumber, ...props }: CounterProps) {
  const [localNumber, setLocalNumber] = useState(initialCounterNumber || props.min);

  if (typeof number === 'number' && setNumber !== undefined) {
    return <CounterContent number={number} setNumber={setNumber} {...props} />;
  }

  return <CounterContent number={localNumber} setNumber={setLocalNumber} {...props} />;
}

type CounterContentProps = Required<Omit<CounterProps, 'initialCounterNumber'>>;

function CounterContent({
  title,
  unit,
  min,
  max,
  updateFormCounter,
  counterKey,
  number,
  setNumber,
}: CounterContentProps) {
  return (
    <div className="flex w-full items-center justify-between px-7">
      {title}

      <div className="flex items-center gap-9">
        <div className="flex items-center gap-9">
          <div
            className={`cursor-pointer p-3 ${number === min ? 'text-gray-300' : ''}`}
            onClick={() => {
              setNumber((prev) => {
                const next = prev - 1;
                if (next < min) {
                  return prev;
                }

                updateFormCounter(next, counterKey);

                return next;
              });
            }}
          >
            <p>-</p>
          </div>

          {number}

          <div
            className={`cursor-pointer p-3 ${number === max ? 'text-gray-300' : ''}`}
            onClick={() => {
              setNumber((prev) => {
                const next = prev + 1;

                if (next > max) {
                  return prev;
                }

                updateFormCounter(next, counterKey);

                return next;
              });
            }}
          >
            <p>+</p>
          </div>
        </div>

        <p className="w-5 text-right">{unit}</p>
      </div>
    </div>
  );
}

interface CategoryProps {
  updateCategory: (category: FormData['category']) => void;
}

function Category({ updateCategory }: CategoryProps) {
  const [category, setCategory] = useState<FormData['category']>('FD');

  return (
    <div className="flex w-full cursor-pointer">
      <div
        className={`center flex w-1/2 items-center justify-center border-r border-black py-3 ${category === 'FD' ? 'bg-black text-white' : ''}`}
        onClick={() => {
          updateCategory('FD');

          setCategory('FD');
        }}
      >
        <p>식당</p>
      </div>
      <div
        className={`flex w-1/2 items-center justify-center py-3 ${category === 'CE' ? 'bg-black text-white' : ''}`}
        onClick={() => {
          updateCategory('CE');

          setCategory('CE');
        }}
      >
        <p>카페</p>
      </div>
    </div>
  );
}

export default CreateRoom;
