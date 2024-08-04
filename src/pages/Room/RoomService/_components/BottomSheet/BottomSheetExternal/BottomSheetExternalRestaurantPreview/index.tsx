import { ImmutableRoomInfoContext } from '@/pages/Room';
import { useContext, useState, useEffect } from 'react';
import useStore from '@/store';
import Slider from 'react-slick';
import { BottomSheetExternalRestaurantPreviewItem } from './BottomSheetExternalRestaurantPreviewItem';

export function BottomSheetExternalRestaurantPreview() {
  const { restaurants } = useContext(ImmutableRoomInfoContext);

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

    const idx = restaurants.findIndex(
      (restaurant) => restaurant.id === currentRestaurantId
    );

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
  }, [currentRestaurantId, slideIndex, setSlides, restaurants]);

  return (
    <Slider
      initialSlide={0}
      centerMode
      centerPadding="12px"
      afterChange={handleSlideIndexChange}
      arrows={false}
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
