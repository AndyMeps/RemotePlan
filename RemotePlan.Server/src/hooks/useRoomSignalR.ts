import * as React from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

type RoomSignalRFunctions = {
  onRoomLoaded: (room: Room) => void;
  onPlayerJoined: (player: Player) => void;
  onPlayerLeft: (player: Player) => void;
  onPlayerVoted: (voteInformation: VoteInformation) => void;
  onAllVoted: (room: Room) => void;
  onPlayerInitialsSet: (player: Player) => void;
  onNewHandStarted: () => void;
};

const useRoomSignalR = (
  roomId: string | undefined,
  functions: RoomSignalRFunctions,
  deps?: React.DependencyList
) => {
  console.log("useRoomSignalR function run");
  const [connection] = React.useState<HubConnection>(
    new HubConnectionBuilder()
      .withUrl("/PlanHub")
      .configureLogging(LogLevel.Information)
      .build()
  );
  const { onRoomLoaded } = functions;

  React.useEffect(() => {
    if (connection != null) {
      const {
        onPlayerJoined,
        onPlayerLeft,
        onPlayerVoted,
        onAllVoted,
        onNewHandStarted,
        onPlayerInitialsSet,
      } = functions;

      console.log("rebinding signalr functions");
      connection.off("PlayerJoined");
      connection.on("PlayerJoined", onPlayerJoined);
      connection.off("PlayerLeft");
      connection.on("PlayerLeft", onPlayerLeft);
      connection.off("PlayerVoted");
      connection.on("PlayerVoted", onPlayerVoted);
      connection.off("AllVoted");
      connection.on("AllVoted", onAllVoted);
      connection.off("NewHand");
      connection.on("NewHand", onNewHandStarted);
      connection.off("PlayerInitialsSet");
      connection.on("PlayerInitialsSet", onPlayerInitialsSet);
    }
  }, deps);

  const start = async () => {
    console.info('Connecting to SignalR...');
    
    if (connection == null || roomId == null) return;

    try {
      // connection.onclose(async () => {
      //   await start();
      // });
      await connection.start();
      console.log("SignalR Connected.");

      const initials = window.localStorage.getItem("initials");

      const result = await connection.invoke<Room>(
        "JoinRoom",
        roomId.toString(),
        initials
      );

      onRoomLoaded(result);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    start();
  }, []);

  const castVote = (roomId: string, vote: string) => {
    connection?.invoke("Vote", roomId.toString(), vote);
  };

  const startNewHand = () => {
    if (roomId === undefined) {
      console.error("No room identifier.");
      return;
    }

    connection?.invoke("StartNewHand", roomId.toString());
  };

  const setInitials = (initials: string) => {
    if (roomId === undefined) {
      console.error("No room identifier.");
      return;
    }

    window.localStorage.setItem("initials", initials);
    connection?.invoke("SetInitials", roomId.toString(), initials);
  };

  return { connection, castVote, startNewHand, setInitials };
};

export default useRoomSignalR;
