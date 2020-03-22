import React, { createContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import Board from "../Board/Board";
import CreateRoom from "../CreateRoom/CreateRoom";
import Board from "../Board/Board";

import io from "socket.io-client";

const ioURL = (() => {
  const ioURL = new URL(window.location.origin);
  ioURL.port = "4000";
  return ioURL.toString();
})();

const socket = io(ioURL);

export const SocketContext = createContext(socket);

function App() {
  return (
    <Router>
      <SocketContext.Provider value={socket}>
        <Switch>
          <Route path="/room/:roomId">
            <Board />
          </Route>
          <Route path="/">
            <CreateRoom />
          </Route>
        </Switch>
      </SocketContext.Provider>
    </Router>
  );
}

export default App;
