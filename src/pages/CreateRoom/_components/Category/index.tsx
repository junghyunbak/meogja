import { useState } from 'react';
import { type FormData } from '../..';

interface CategoryProps {
  updateCategory: (category: FormData['category']) => void;
}

export function Category({ updateCategory }: CategoryProps) {
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
