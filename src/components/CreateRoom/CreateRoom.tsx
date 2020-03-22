import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { SocketContext } from "../App/App";

export default function CreateRoom() {
  const history = useHistory();
  const socket = useContext(SocketContext);

  const onClick = () => {
    socket.emit("create room");
  };

  socket.once("room created", (data: { id: string }) => {
    history.push(`/room/${data.id}`);
  });

  return <button onClick={onClick}>Create room</button>;
}
