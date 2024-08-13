import { HttpStatus } from '@nestjs/common';
import { BasicException } from './basic.exception';
import { RESPONSE_CODE } from 'src/constants/api';

export class ForbiddenException extends BasicException {
  constructor() {
    super(
      '방 접속인원이 가득 찼습니다.',
      HttpStatus.FORBIDDEN,
      RESPONSE_CODE.NO_EMTPY_SPACE,
    );
  }
}
