import * as React from "react";
import { Card, CardContainer } from "@atoms";
import styled from "styled-components";

interface IProps {
  showResults: boolean;
  owner: Player;
  players: { playerId: string; initials: string | null }[];
  votes: { playerId: string; vote: string | null }[];
}

const CardOverlayWrapper = styled.div`
  position: relative;

  & + & {
    margin-left: 8px;
  }
`;

const OwnerFlag = styled.div`
  position: absolute;
  left: -10px;
  top: -10px;
  border-radius: 25px;
  font-family: sans-serif;
  width: 20px;
  height: 20px;
  font-size: 13px;
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const Initials = styled.div`
  position: absolute;
  right: -6px;
  bottom: -6px;
  border-radius: 25px;
  font-family: sans-serif;
  background-color: #ff9800;
  width: 20px;
  height: 20px;
  font-size: 8px;
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;
`;
const CardOverlay = (props: {
  children: React.ReactNode;
  isOwner: boolean;
  initials: string | null;
}) => (
  <CardOverlayWrapper>
    {props.children}
    {props.initials && <Initials>{props.initials}</Initials>}
    {props.isOwner && <OwnerFlag title="This player controls the room.">⭐</OwnerFlag>}
  </CardOverlayWrapper>
);
const PlayerCards = ({ players, votes, showResults, owner }: IProps) => (
  <div id="player-cards">
    <h1>Players:</h1>
    <CardContainer>
      {players.map((p) => (
        <CardOverlay key={p.playerId} initials={p.initials} isOwner={p.playerId == owner.playerId}>
          <Card
            key={p.playerId}
            choice={votes.find((v) => v.playerId == p.playerId)?.vote || null}
            showValue={showResults}
          />
        </CardOverlay>
      ))}
    </CardContainer>
  </div>
);

export default PlayerCards;
