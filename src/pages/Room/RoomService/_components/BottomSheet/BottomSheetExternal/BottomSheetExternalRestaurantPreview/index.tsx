import { ImmutableRoomInfoContext } from '@/pages/Room';
import { useContext, useState, useEffect } from 'react';
import useStore from '@/store';
import Slider from 'react-slick';
import { BottomSheetExternalRestaurantPreviewItem } from './BottomSheetExternalRestaurantPreviewItem';

export function BottomSheetExternalRestaurantPreview() {
  const { restaurants: originRestaurants } = useContext(
    ImmutableRoomInfoContext
  );

  const [myPicky] = useStore((state) => [state.myPicky]);

  const [currentRestaurantId, setCurrentRestaurantId] = useStore((state) => [
    state.currentRestaurantId,
    state.setCurrentRestaurantId,
  ]);
  const [map] = useStore((state) => [state.map]);

  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [slides, setSlides] = useState<Restaurant[]>([]);

  const handleSlideIndexChange = (slideIndex: number) => {
    const restaurant = slides[slideIndex];

    if (!restaurant) {
      return;
    }

    setCurrentRestaurantId(restaurant.id);
    setSlideIndex(slideIndex);
    map?.setCenter(new naver.maps.LatLng(restaurant.lat, restaurant.lng));
  };

  useEffect(() => {
    if (currentRestaurantId === null) {
      return;
    }

    const restaurants = originRestaurants.filter(
      (restaurant) => restaurant.category !== myPicky
    );

    const idx = restaurants.findIndex(
      (restaurant) => restaurant.id === currentRestaurantId
    );

    if (idx === -1) {
      setSlides([]);

      return;
    }

    const prev =
      restaurants[(idx - 1 + restaurants.length) % restaurants.length];
    const cur = restaurants[idx];
    const next = restaurants[(idx + 1) % restaurants.length];

    const tmp = [cur, next, prev];

    /**
     * 현재 슬라이드의 인덱스를 고려하여 오차 계산
     *
     * [ ]: 계산은 맞지만 간헐적으로 slick이 올바르지 않게 표시되는 경우가 있다.
     */
    for (let i = 0; i < slideIndex; i++) {
      tmp.unshift(tmp.pop()!);
    }

    setSlides(tmp);
  }, [currentRestaurantId, slideIndex, setSlides, originRestaurants, myPicky]);

  if (!currentRestaurantId) {
    return null;
  }

  return (
    <Slider
      initialSlide={0}
      centerMode
      centerPadding="12px"
      afterChange={handleSlideIndexChange}
      arrows={false}
      /**
       * [ ]: 슬라이더에 마진을 직접 추가하는것은 SOC가 잘 되어있지 않다고 생각
       */
      className="pointer-events-none mb-3"
    >
      {slides.map((restaurant) => {
        return (
          <BottomSheetExternalRestaurantPreviewItem
            key={restaurant.id}
            restaurant={restaurant}
          />
        );
      })}
    </Slider>
  );
}
