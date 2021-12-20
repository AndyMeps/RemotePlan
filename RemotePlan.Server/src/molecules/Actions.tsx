import * as React from "react";

interface IProps {
  isOwner: boolean,
  onStartNewHand: () => void;
  onSetInitials: (initials: string) => void;
}

const Actions = ({ onStartNewHand, onSetInitials, isOwner }: IProps) => {
  const [initials, setInitials] = React.useState<string>(window.localStorage.getItem("initials") || '');
  return (
    <div id="actions">
      {isOwner && <button onClick={onStartNewHand}>Start New Hand</button>}
      <input type="text" maxLength={3} onChange={(evt) => setInitials(evt.currentTarget.value)} value={initials} />
      <button onClick={() => { onSetInitials(initials); }}>Set</button>
    </div>
  );
};

export default Actions;
