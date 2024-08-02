import Chicken from '@/assets/svgs/chicken.svg?react';
import Chinese from '@/assets/svgs/chicken.svg?react';
import Hamburger from '@/assets/svgs/hamburger.svg?react';
import Korean from '@/assets/svgs/korean.svg?react';
import Pizza from '@/assets/svgs/pizza.svg?react';
import Snack from '@/assets/svgs/snack.svg?react';
import Western from '@/assets/svgs/western.svg?react';
import Japan from '@/assets/svgs/japan.svg?react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FDComponents = [
  Chicken,
  Hamburger,
  Korean,
  Pizza,
  Snack,
  Japan,
  Western,
  Chinese,
];

interface AutoPlayFDProps {
  reverse?: boolean;
}

export function AutoPlayFD({ reverse = false }: AutoPlayFDProps) {
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
            const FD = FDComponents[Math.floor(Math.random() * 8)];

            return (
              <div className="h-8" key={i}>
                <div className="flex size-full items-center justify-center">
                  <FD className="h-full" />
                </div>
              </div>
            );
          })}
      </Slider>
    </div>
  );
}
