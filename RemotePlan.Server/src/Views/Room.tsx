import * as React from "react";
import { useLog, useRoomSignalR } from "@hooks";
import { Actions, CardOptions, PlayerCards, History } from "@molecules";
import styled from "styled-components";
import { useParams } from "react-router";

type Parameters = {
  roomId: string;
}

const excludePlayer =
  (exceptPlayer: Player) =>
  (players: Player[]): Player[] => {
    return players.filter((p) => p.playerId !== exceptPlayer.playerId);
  };

const addOrUpdateVote =
  (voteResult: VoteInformation) =>
  (votes: Vote[]): Vote[] => {
    if (!votes.find((v) => v.playerId == voteResult.playerId)) {
      return [
        ...votes,
        { playerId: voteResult.playerId, vote: voteResult.vote },
      ];
    }

    return [
      ...votes.map((p) =>
        p.playerId === voteResult.playerId
          ? { playerId: p.playerId, vote: voteResult.vote }
          : p
      ),
    ];
  };

const PlayingSurface = styled.div`
  flex: 1;
  background-color: ${props => props.theme.colors.background.one};
  color: ${props => props.theme.colors.text.contrast};
  padding: 15px;
`;

const RoomWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const Room = () => {
  const { roomId } = useParams<Parameters>();
  const [log, addLogItem, clearLog] = useLog();
  const [room, setRoom] = React.useState<Room>();
  const [roundEnded, setRoundEnded] = React.useState<boolean>(false);

  const handleRoomLoaded = (room: Room) => {
    setRoom(room);
  };

  const handlePlayerJoined = (player: Player) => {
    addLogItem(`Player Joined [${player.initials || player.playerId}]`);
    setRoom((prevState) => {
      if (prevState === undefined) return prevState;

      return {
        ...prevState,
        players: {
          ...prevState.players,
          [player.playerId]: player,
        },
      };
    });

    if (roundEnded) {
      addLogItem(
        `New player joined at the end of a hand; starting a new hand.`
      );
      startNewHand();
    }
  };

  const handlePlayerLeft = (player: Player) => {
    addLogItem(`Player Left [${player.initials || player.playerId}]`);
    setRoom((prevState) => {
      if (prevState === undefined) return prevState;

      const { [player.playerId]: _, ...restPlayers } = prevState.players;
      return {
        ...prevState,
        players: restPlayers,
      };
    });
  };

  const playerVoted = (voteResult: VoteInformation) => {
    if (room === undefined) {
      addLogItem('Room undefined when attempting to record player vote.');
      return;
    }

    const player = Object.values(room.players).find((p) => p.playerId == voteResult.playerId);

    addLogItem(
      `Player [${player?.initials || player?.playerId}] cast their vote.`
    );
    setRoom(prevState => {
      if (prevState === undefined)
        return prevState;

      return {
        ...prevState,
        votes: {
          ...prevState.votes,
          [voteResult.playerId]: voteResult.vote,
        }
      };
    });
  };

  const handlePlayerVoted = (voteResult: VoteInformation) => {
    playerVoted(voteResult)
  };

  const handleAllVoted = (room: Room) => {
    addLogItem(`All votes cast!`);
    setRoom(room);
    setRoundEnded(true);
  };

  const handleNewHandStarted = () => {
    clearLog();
    addLogItem(`Starting a new hand.`);
    setRoundEnded(false);
    setRoom(prevState => {
      if (prevState === undefined) return prevState;

      return {
        ...prevState,
        votes: {},
      };
    });
  };

  const handlePlayerInitialsSet = (updatedPlayer: Player) => {
    addLogItem(
      `Player initials set for [${updatedPlayer.playerId}] => '${updatedPlayer.initials}''.`
    );
    setRoom(prevState => {
      if (prevState === undefined) return prevState;

      return {
        ...prevState,
        players: {
          ...prevState.players,
          [updatedPlayer.playerId]: updatedPlayer,
        },
      }
    });
  };

  const handleStartNewHand = () => {
    startNewHand();
  };

  const handleVoteCast = (vote: string) => {
    if (roundEnded) {
      return;
    }
    if (roomId === undefined) {
      console.error('No room identifier.');
      return;
    }
    castVote(roomId, vote);
  };

  const handleSetInitials = (initials: string) => {
    setInitials(initials);
  };

  const { connection, castVote, startNewHand, setInitials } = useRoomSignalR(roomId, {
    onPlayerJoined: handlePlayerJoined,
    onPlayerLeft: handlePlayerLeft,
    onAllVoted: handleAllVoted,
    onPlayerVoted: handlePlayerVoted,
    onRoomLoaded: handleRoomLoaded,
    onNewHandStarted: handleNewHandStarted,
    onPlayerInitialsSet: handlePlayerInitialsSet,
  }, [room]);

  if (room === undefined)
    return null;

  return (
    <RoomWrapper id={`room-${roomId}`}>
      <PlayingSurface id="playing-surface">
        <PlayerCards owner={room.owner} showResults={roundEnded} players={Object.values(room.players || {})} votes={Object.keys(room.votes || {}).map(k => ({ playerId: k, vote: room.votes[k]}))} />
        <CardOptions onVoteCast={handleVoteCast} />
        <Actions
          isOwner={room.owner.playerId == connection?.connectionId}
          onStartNewHand={handleStartNewHand}
          onSetInitials={handleSetInitials}
        />
      </PlayingSurface>
      <History log={log} />
    </RoomWrapper>
  );
};

export default Room;
