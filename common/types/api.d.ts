type Code = {
  /**
   * 성공적으로 요청이 처리되거나 리소스가 생성되었을 경우
   */
  OK: '0000';

  /**
   * api의 명세대로 요청하지 않았을 경우
   */
  BAD_REQUEST: 'C400';

  /**
   * 존재하지 않는 방과 관련된 요청이 발생했을 경우
   */
  BAD_ROOM: 'C401';

  /**
   * 방 접속 리스트에 없는 사용자가 요청을 시도할 경우
   */
  NOT_AUTHORITY: 'A001';

  /**
   * 방 접속 최대인원을 초과했을 경우
   */
  NO_EMTPY_SPACE: 'R501';
};

type CodeValues = Code[keyof Code];

type ResponseTemplate<T> = {
  data: T;
  message: string;
  code: CodeValues;
};