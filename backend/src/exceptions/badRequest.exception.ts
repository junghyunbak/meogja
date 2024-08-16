import { RESPONSE_CODE } from 'src/constants/api';
import { BasicException } from './basic.exception';
import { HttpStatus } from '@nestjs/common';

export class BadRequestException extends BasicException {
  constructor() {
    super(
      '잘못된 요청입니다.',
      HttpStatus.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
    );
  }
}

export class BadRoomException extends BasicException {
  constructor() {
    super(
      '존재하지 않는 방입니다.',
      HttpStatus.BAD_REQUEST,
      RESPONSE_CODE.BAD_ROOM,
    );
  }
}
