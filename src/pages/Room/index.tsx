import { useParams } from 'react-router-dom';

export function Room() {
  const { roomId } = useParams();

  return <div>{roomId}</div>;
}
