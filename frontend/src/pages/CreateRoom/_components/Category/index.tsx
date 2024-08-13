import { useState } from 'react';
import { type FormData } from '../..';

interface CategoryProps {
  updateCategory: (category: FormData['category']) => void;
}

export function Category({ updateCategory }: CategoryProps) {
  const [category, setCategory] = useState<FormData['category']>('FD6');

  return (
    <div className="flex w-full cursor-pointer">
      <div
        className={`center flex w-1/2 items-center justify-center border-r-2 border-black py-3 ${category === 'FD6' ? 'cursor-default bg-black text-white' : ''}`}
        onClick={() => {
          updateCategory('FD6');

          setCategory('FD6');
        }}
      >
        <p>식당</p>
      </div>
      <div
        className={`flex w-1/2 items-center justify-center py-3 ${category === 'CE7' ? 'cursor-default bg-black text-white' : ''}`}
        onClick={() => {
          updateCategory('CE7');

          setCategory('CE7');
        }}
      >
        <p>카페</p>
      </div>
    </div>
  );
}
