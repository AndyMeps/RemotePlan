import * as React from "react";
import styled from "styled-components";

interface ICardProps {
  choice: string | null;
  showValue?: boolean,
  onClick?: (choice: string) => void;
}

const CardOutline = styled.div`
  background-color: #757575;
  border: 1px solid #616161;
  width: 40px;
  font-family: sans-serif;
  height: 60px;
  border-radius: 2px;
  justify-content: center;
  display: flex;
  flex-flow: row;
  align-items: center;
  cursor: pointer;

  & + & {
    margin-left: 5px;
  }
`;

const Card = ({ choice, showValue, onClick }: ICardProps) => {
  const handleClick = () => {
    if (typeof onClick === "function" && choice != null) {
      onClick(choice);
    }
  };

  const resolveValue = (): string => {
    if (choice != null) {
        return showValue ? choice : '-';
    }

    return '';
  }

  return <CardOutline onClick={handleClick}>{resolveValue()}</CardOutline>;
};

export default Card;
