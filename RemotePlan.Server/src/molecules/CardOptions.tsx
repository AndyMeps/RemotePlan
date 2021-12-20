import * as React from "react";
import { Card, CardContainer } from "@atoms";

interface IProps {
  onVoteCast: (choice: string) => void;
}

const DECK_FIBONACCI = ["0", "1", "2", "3", "5", "8", "13", "21", "?", "♾️", "☕"];

const CardOptions = ({ onVoteCast }: IProps) => {
  return (
    <div id="card-options">
      <h1>Options:</h1>
      <CardContainer>
        {DECK_FIBONACCI.map((choice) => (
          <Card key={choice} choice={choice} showValue onClick={onVoteCast} />
        ))}
      </CardContainer>
    </div>
  );
};

export default CardOptions;
