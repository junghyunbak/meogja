import { useState } from 'react';
import { type FormCounterData } from '../..';

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

export function Counter({ number, setNumber, initialCounterNumber, ...props }: CounterProps) {
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
            className={`cursor-pointer p-3 ${number === min ? 'cursor-not-allowed text-gray-300' : ''}`}
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
            className={`cursor-pointer p-3 ${number === max ? 'cursor-not-allowed text-gray-300' : ''}`}
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
