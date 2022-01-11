import { Button, Input } from "@atoms";
import * as React from "react";
import { useNavigate } from "react-router";
import styled from 'styled-components';

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
`;

const JoinLabel = styled.h1`
  color: ${props => props.theme.colors.text.contrast};
`;

const RoomContainer = styled.div`
  color: ${props => props.theme.colors.text.contrast};
`;

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
      {err && <ErrorMessage>{err}</ErrorMessage>}
      <RoomContainer>
        <JoinLabel>Planning Rooms</JoinLabel>
        <Input type="number" value={roomId} onChange={handleRoomIdInputChange} />
        <Button onClick={handleJoinRoom} disabled={roomId.length === 0}>Join</Button>
         or 
        <Button onClick={handleCreateRoom}>Create Room</Button>
      </RoomContainer>
    </div>
  )
}

export default Home;
