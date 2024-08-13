import { HttpException } from '@nestjs/common';

export class BasicException extends HttpException {
  code: CodeValues;

  constructor(message: string, status: number, code: CodeValues) {
    super(message, status);

    this.code = code;
  }
}
