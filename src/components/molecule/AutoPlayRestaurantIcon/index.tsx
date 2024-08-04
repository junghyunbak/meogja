import { RESTAURANT_SVG_FC } from '@/constants';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface AutoPlayRestaurantIconProps {
  reverse?: boolean;
}

export function AutoPlayRestaurantIcon({
  reverse = false,
}: AutoPlayRestaurantIconProps) {
  return (
    <div className="w-full py-4">
      <Slider
        slidesToShow={9}
        slidesToScroll={1}
        infinite
        autoplay
        autoplaySpeed={2000}
        speed={2000}
        cssEase={'linear'}
        arrows={false}
        draggable={false}
        pauseOnHover={false}
        rtl={reverse}
      >
        {Array(20)
          .fill(null)
          .map((_, i) => {
            const RestaurantSvg =
              RESTAURANT_SVG_FC[Math.floor(Math.random() * 8)];

            return (
              <div className="h-8" key={i}>
                <div className="flex size-full items-center justify-center">
                  <RestaurantSvg className="h-full" />
                </div>
              </div>
            );
          })}
      </Slider>
    </div>
  );
}
