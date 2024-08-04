import { type Server, Response } from 'miragejs';

export function createRoom(this: Server) {
  this.post('/api/create-room', (_, request) => {
    const { requestBody } = request;

    const { lat, lng, capacity, minute, radius } = JSON.parse(requestBody);

    if (!lat || !lng || !capacity || !minute || !radius) {
      return new Response(400);
    }

    /**
     * 실제로는 uuid로 식별자를 생성해야함.
     */
    const roomId = '0';

    return new Response(201, {}, { data: { roomId } });
  });
}
