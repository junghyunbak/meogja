export function createRedisStoreKey(
  roomId: RoomId,
  type: 'mutable' | 'immutable' | 'joinList',
) {
  return `room-id:${roomId}:room-info:${type}`;
}
