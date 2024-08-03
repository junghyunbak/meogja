import { IdentifierContext, ImmutableRoomInfoContext } from '@/pages/Room';
import useStore from '@/store';
import { memo, useContext, useEffect, useState } from 'react';
import Checkbox from '@/assets/svgs/checkbox.svg?react';
import Chevron from '@/assets/svgs/chevron.svg?react';
import { useMutation } from 'react-query';
import axios from 'axios';
import Slider from 'react-slick';
import * as geolib from 'geolib';

export const RestaurantCards = memo(() => {
  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const [restaurantId, setRestaurantId] = useStore((state) => [
    state.restaurantId,
    state.setRestaurantId,
  ]);
  const [map] = useStore((state) => [state.map]);

  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [slides, setSlides] = useState<Restaurant[]>([]);

  const handleSlideIndexChange = (slideIndex: number) => {
    const restaurant = slides[slideIndex];

    if (!restaurant) {
      return;
    }

    const { id, lat, lng } = restaurant;

    setRestaurantId(id);
    setSlideIndex(slideIndex);
    map?.setCenter(new naver.maps.LatLng(lat, lng));
  };

  useEffect(() => {
    if (restaurantId === null) {
      return;
    }

    const idx = restaurants.findIndex(({ id }) => id === restaurantId);

    if (idx === -1) {
      return;
    }

    const prev =
      restaurants[(idx - 1 + restaurants.length) % restaurants.length];
    const cur = restaurants[idx];
    const next = restaurants[(idx + 1) % restaurants.length];

    const tmp = [cur, next, prev];

    /**
     * 현재 슬라이드의 인덱스를 고려하여 오차 계산
     */
    for (let i = 0; i < slideIndex; i++) {
      tmp.unshift(tmp.pop()!);
    }

    setSlides(tmp);
  }, [restaurantId, slideIndex, setSlides, restaurants]);

  if (!restaurantId) {
    return null;
  }

  return (
    <Slider
      initialSlide={0}
      centerMode
      centerPadding="20px"
      afterChange={handleSlideIndexChange}
      arrows={false}
    >
      {slides.map((restaurant) => {
        return <Card key={restaurant.id} restaurant={restaurant} />;
      })}
    </Slider>
  );
});

interface CardProps {
  restaurant: Restaurant;
}

function Card({ restaurant }: CardProps) {
  const [mySelect, setMySelect] = useStore((state) => [
    state.mySelect,
    state.setMySelect,
  ]);

  const [myLatLng] = useStore((state) => [state.myLatLng]);

  const { userId, roomId } = useContext(IdentifierContext);

  const updateMySelectMutation = useMutation({
    mutationKey: [],
    mutationFn: async () => {
      await axios.patch('/api/update-user-select', {
        userId,
        roomId,
        restaurantId: restaurant.id,
      });
    },
  });

  const handleChooseButtonClick = () => {
    /**
     * 낙관적 처리
     */
    setMySelect((prev) => {
      const next = [...prev];

      const idx = next.indexOf(restaurant.id);

      if (idx === -1) {
        next.push(restaurant.id);
      } else {
        next.splice(idx, 1);
      }

      return next;
    });

    updateMySelectMutation.mutate();
  };

  const isSelect = mySelect.includes(restaurant.id);

  const km = Math.floor(
    geolib.getDistance(
      { latitude: myLatLng.lat, longitude: myLatLng.lng },
      { latitude: restaurant.lat, longitude: restaurant.lng }
    ) / 1000
  );

  return (
    <div className="px-1.5 pb-3">
      <div className="flex w-full gap-3 rounded-md bg-bg p-3">
        <div
          className="flex aspect-square h-12 cursor-pointer"
          onClick={handleChooseButtonClick}
        >
          <Checkbox
            className={[
              'size-full',
              isSelect ? 'text-primary' : 'text-bg-secondary',
            ].join(' ')}
          />
        </div>

        <div className="flex flex-col justify-between">
          <a
            className="flex cursor-pointer items-center gap-2 text-white"
            target="_blank"
            href={restaurant.placeUrl}
          >
            <p>{restaurant.name}</p>
            <Chevron className="h-3 rotate-180" />
          </a>
          <p className="text-sm text-gray-400">
            현재 내 위치로부터 약 <span className="text-primary">{km}km</span>
            떨어져 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
