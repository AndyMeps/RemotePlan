import * as React from "react";
import styled from "styled-components";

const HistoryWrapper = styled.div`
  min-width: 350px;
  overflow: auto;
  background-color: #616161;
  border-left: 1px solid #424242;
  padding: 10px;
  font-size: 12px;
  font-family: monospace;
`;

const HistoryItemDate = styled.small`
  color: #999;
`;

const HistoryItemContent = styled.div`
  color: white;
`;

const HistoryItem = styled.div`
  display: flex;
  flex-flow: column;

  & + & {
    margin-top: 5px;
  }
`;

const History = ({ log }: { log: LogEntry[]; clearLog?: () => void }) => (
  <HistoryWrapper id="history">
    {log.map((item) => (
      <HistoryItem key={`${item.content}${item.timeStamp.toISOString()}`}>
        <HistoryItemDate>{item.timeStamp.toISOString()}</HistoryItemDate>
        <HistoryItemContent>{item.content}</HistoryItemContent>
      </HistoryItem>
    ))}
  </HistoryWrapper>
);

export default History;
