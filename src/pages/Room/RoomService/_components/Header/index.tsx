import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';
import Logo from '@/assets/svgs/logo.svg?react';
import Pen from '@/assets/svgs/pen.svg?react';
import { IdentifierContext } from '@/pages/Room';
import useStore from '@/store';
import { useUpdateUserName } from '@/hooks/useUpdateUserName';

export const Header = () => {
  const { userId, roomId } = useContext(IdentifierContext);

  const [isEdit, setIsEdit] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * 헤더 내 input에 사용될 이름
   */
  const [name, setName] = useState('');

  /**
   * 실제 서버의 이름
   */
  const [myName] = useStore((state) => [state.myName]);

  const { updateUserNameMutation } = useUpdateUserName(roomId, userId, setName);

  const handleEditButtonClick = () => {
    setIsEdit(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEdit(false);

    updateUserNameMutation.mutate(name);
  };

  /**
   * 서버에 저장된 이름과 동기화
   */
  useEffect(() => {
    setName(myName);
  }, [myName]);

  /**
   * 편집이 시작되면 input에 포커스, 텍스트 드래그
   */
  useEffect(() => {
    if (!isEdit || !inputRef.current) {
      return;
    }

    inputRef.current.focus();
    inputRef.current.select();
  }, [isEdit]);

  /**
   * 엔터를 누를경우 input에서 focus를 해제
   */
  useEffect(() => {
    const handleEnterDown = (e: KeyboardEvent) => {
      if (!inputRef.current) {
        return;
      }

      if (e.key === 'Enter') {
        inputRef.current.blur();
      }
    };

    window.addEventListener('keydown', handleEnterDown);

    return () => {
      window.removeEventListener('keydown', handleEnterDown);
    };
  }, [inputRef]);

  return (
    <div className="flex w-full items-center justify-between bg-bg p-5">
      <Logo className="h-6 text-white" />

      <div className="flex translate-x-4 items-center gap-3">
        <AutoSizeInput
          value={name}
          ref={inputRef}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={!isEdit}
        />
        {!isEdit && (
          <div onClick={handleEditButtonClick} className="h-4 cursor-pointer">
            <Pen className="h-full" />
          </div>
        )}
      </div>

      <div className="w-9" />
    </div>
  );
};

interface AutoSizeInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const AutoSizeInput = forwardRef<HTMLInputElement, AutoSizeInputProps>(
  ({ value, ...props }, ref) => {
    return (
      <div className="relative h-5 min-w-1 max-w-[200px]">
        <p className="truncate text-base text-transparent">{value}</p>
        <input
          className="absolute inset-0 w-full bg-transparent text-white outline-none"
          value={value}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);
