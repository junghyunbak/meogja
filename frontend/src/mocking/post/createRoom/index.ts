import { RESPONSE_CODE } from '@/constants/api';
import { createResponseData } from '@/utils';
import httpStatus from 'http-status';
import { type Server, Response } from 'miragejs';
import { sleep } from '@/utils';

export function createRoom(this: Server) {
  this.post('/api/create-room', async (_, request) => {
    const { requestBody } = request;

    const { lat, lng, capacity, endTime, radius, category, maxPickCount } = JSON.parse(requestBody);

    if (
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      typeof capacity !== 'number' ||
      typeof endTime !== 'number' ||
      typeof radius !== 'number' ||
      typeof category !== 'string' ||
      typeof maxPickCount !== 'number'
    ) {
      return new Response(
        httpStatus.BAD_REQUEST,
        {},
        createResponseData({}, RESPONSE_CODE.BAD_REQUEST, '잘못된 요청입니다.')
      );
    }

    await sleep(2000);

    /**
     * 실제 api 구현에서는 음식점 정보를 얻어오고, uuid로 식별자를 생성하여 방을 만들어야함.
     */
    const roomId = '0';

    return new Response(
      httpStatus.CREATED,
      {},
      createResponseData<{ roomId: RoomId }>({ roomId }, RESPONSE_CODE.OK, '성공적으로 방이 생성되었습니다.')
    );
  });
}
