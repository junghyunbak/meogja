import { HttpStatus } from '@nestjs/common';
import { BasicException } from './basic.exception';
import { RESPONSE_CODE } from 'src/constants/api';

export class UnauthorizedException extends BasicException {
  constructor() {
    super(
      '방에 속하지 않은 사용자의 접속입니다.',
      HttpStatus.UNAUTHORIZED,
      RESPONSE_CODE.NOT_AUTHORITY,
    );
  }
}
