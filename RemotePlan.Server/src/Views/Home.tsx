import * as React from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = React.useState<string>('');
  const [err, setErr] = React.useState<string | null>(null);

  const handleRoomIdInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(evt.currentTarget.value);
  };

  const handleJoinRoom = async () => {
    const result = await fetch(`/api/room/${roomId}`);
    if (result.status === 200) {
      navigate(`/room/${roomId}`);
      return;
    }
    if (result.status === 404) {
      setErr('Could not find room.');
      return;
    }
    setErr('Something went wrong.');
  };

  const handleCreateRoom = async () => {
    const result = await fetch(`/api/room`, { method: 'post' });

    if (result.status === 200) {
      const room = (await result.json() as Room);
      navigate(`room/${room.roomId}`);
      return;
    }

    setErr('Something went wrong.');
  };

  return (
    <div>
      {err && <div>{err}</div>}
      <div>
        <h1>Join Room</h1>
        <input type="number" value={roomId} onChange={handleRoomIdInputChange} />
        <button onClick={handleJoinRoom} disabled={roomId.length === 0}>Join</button>
      </div>
      <div>
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
    </div>
  )
}

export default Home;
