import { Button, Input } from "@atoms";
import * as React from "react";
import styled from 'styled-components';

interface IProps {
  isOwner: boolean,
  onStartNewHand: () => void;
  onSetInitials: (initials: string) => void;
}

const Container = styled.div`
  padding: .5rem 0rem;
`;

const Actions = ({ onStartNewHand, onSetInitials, isOwner }: IProps) => {
  const [initials, setInitials] = React.useState<string>(window.localStorage.getItem("initials") || '');
  return (
    <Container id="actions">
      {isOwner && <Button onClick={onStartNewHand} appearance="warn">Start New Hand</Button>}
      <Input type="text" maxLength={3} onChange={(evt) => setInitials(evt.currentTarget.value)} value={initials} />
      <Button onClick={() => { onSetInitials(initials); }}>Set</Button>
    </Container>
  );
};

export default Actions;
