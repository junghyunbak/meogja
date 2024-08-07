type Code = {
  /**
   * 성공적으로 요청이 처리되거나 리소스가 생성되었을 경우 코드
   */
  OK: '0000';

  BAD_REQUEST: 'C400';

  BAD_ROOM: 'C401';

  NOT_AUTHORITY: 'A001';
};

type CodeValues = Code[keyof Code];

type ResponseTemplate<T> = {
  data: T;
  message: string;
  code: CodeValues;
};
