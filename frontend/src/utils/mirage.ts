export function createResponseData<T extends object = object>(data: T, code: CodeValues, message = '') {
  return {
    data,
    code,
    message,
  };
}
