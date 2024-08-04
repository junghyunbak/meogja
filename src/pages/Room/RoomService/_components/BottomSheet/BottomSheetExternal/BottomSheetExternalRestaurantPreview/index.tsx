import { ImmutableRoomInfoContext } from '@/pages/Room';
import { useContext, useState, useEffect } from 'react';
import useStore from '@/store';
import Slider from 'react-slick';
import { BottomSheetExternalRestaurantPreviewItem } from './BottomSheetExternalRestaurantPreviewItem';

interface BottomSheetExternalRestaurantPreviewProps {}

export function BottomSheetExternalRestaurantPreview({}: BottomSheetExternalRestaurantPreviewProps) {
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
