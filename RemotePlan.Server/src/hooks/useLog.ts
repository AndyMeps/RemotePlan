import * as React from "react";

const useLog = (): [LogEntry[], (content: string) => void, () => void] => {
  const [log, setLog] = React.useState<LogEntry[]>([]);

  return [
    log,
    (content: string) => {
      console.info(content);
      setLog((prevState) => [...prevState, { timeStamp: new Date(), content }]);
    },
    () => {
      setLog([]);
    },
  ];
};

export default useLog;
