import Chicken from '@/assets/svgs/chicken.svg?react';
import Chinese from '@/assets/svgs/chinese.svg?react';
import Hamburger from '@/assets/svgs/hamburger.svg?react';
import Korean from '@/assets/svgs/korean.svg?react';
import Pizza from '@/assets/svgs/pizza.svg?react';
import Snack from '@/assets/svgs/snack.svg?react';
import Western from '@/assets/svgs/western.svg?react';
import Japan from '@/assets/svgs/japan.svg?react';
import React from 'react';

export const RESTAURANT_SVG_FC = [Chicken, Hamburger, Korean, Pizza, Snack, Japan, Western, Chinese];

export const RESTAURANT_KIND: {
  kind: RestaurantKind;
  svg: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  name: string;
}[] = [
  { kind: 'chicken', svg: Chicken, name: '치킨' },
  { kind: 'hamburger', svg: Hamburger, name: '햄버거' },
  { kind: 'korean', svg: Korean, name: '한식' },
  { kind: 'pizza', svg: Pizza, name: '피자' },
  { kind: 'snack', svg: Snack, name: '분식' },
  { kind: 'japan', svg: Japan, name: '일식' },
  { kind: 'western', svg: Western, name: '양식' },
  { kind: 'chinese', svg: Chinese, name: '중식' },
];

export const LOCALSTORAGE_DUMP_KEY = 'miragejs-dump';

export const NICKNAME_ADJECTIVE = [
  '멋진',
  '신난',
  '춤추는',
  '신중한',
  '진지한',
  '멍때리는',
  '용감한',
  '즐거운',
  '행복한',
  '피곤한',
  '부지런한',
  '생각하는',
  '집중하는',
  '외출하는',
  '놀러가는',
  '고민하는',
  '고민중인',
  '혼란스러운',
  '맛집 찾는',
  '먹는데 진심인',
];

export const NICKNAME_NOUN = [
  '육개장',
  '갈비찜',
  '쫄면',
  '라면',
  '카레',
  '떡볶이',
  '라볶이',
  '돈까스',
  '돈부리',
  '튀김우동',
  '새우튀김',
  '계란초밥',
  '치즈피자',
  '햄버거',
  '파스타',
  '쌀국수',
  '짜장면',
  '짬뽕',
  '탕수육',
  '샌드위치',
];

export const RIGHT: RIGHT = 0;

export const LEFT: LEFT = 1;
