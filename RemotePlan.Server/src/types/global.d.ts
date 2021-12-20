declare type Vote = {
  playerId: string;
  vote: string;
};

declare type Player = {
  playerId: string;
  initials: string | null;
};

declare type VoteInformation = {
  roomId: string;
  playerId: string;
  vote: string;
};

declare type Room = {
  roomId: string;
  owner: Player;
  players: {
    [playerId: string]: Player;
  };
  votes: {
    [playerId: string]: string;
  };
};

declare type LogEntry = {
  timeStamp: Date,
  content: string,
};
