export function createCacheStoreKey(
  roomId: RoomId,
  type: 'mutable' | 'immutable',
) {
  return `room-id:${roomId}:room-info:${type}`;
}
