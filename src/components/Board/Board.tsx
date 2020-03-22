import React, {
  useEffect,
  useState,
  useContext,
  useReducer,
  createContext
} from "react";
import throttle from "lodash.throttle";
import { SocketContext } from "../App/App";
import { assoc, mergeRight } from "ramda";

import Cursors from "../Cursors/Cursors";
import Cards from "../Cards/Cards";

import { userId } from "../../utils/user";
import { byType } from "../../utils/store";

const initialState = {};
export const ObjectContext = createContext<{ [identifier: string]: Base }>({});

const reducer = (state: any, action: { type: string; payload: any }) => {
  switch (action.type) {
    case "STATE/INIT":
      return action.payload;
    case "STATE/UPDATE/OBJECT":
      const current = state[action.payload.identifier];
      const updated = mergeRight(current, action.payload);
      return assoc(action.payload.identifier, updated, state);
    default:
      return state;
  }
};

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [readyState, setReady] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit("USER/WELCOME", userId());
    socket.on("USER/WELCOME", (user: User) => {
      // console.log(user);

      for (const key of ["identifier", "color"]) {
        // @ts-ignore
        window.localStorage.setItem(`user-${key}`, user[key]);
      }

      setReady(true);
    });
  }, []);

  useEffect(() => {
    socket.once("STATE/INIT", (state: any) =>
      dispatch({ type: "STATE/INIT", payload: state })
    );

    socket.on("STATE/UPDATE/OBJECT", (state: any) => {
      dispatch({ type: "STATE/UPDATE/OBJECT", payload: state });
    });
  }, []);

  useEffect(() => {
    const onMouseMove = throttle((event: MouseEvent) => {
      const position = [event.pageX, event.pageY];
      socket.emit("UPDATE/OBJECT", {
        identifier: userId(),
        position
      });
    }, 150);

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Handle object move
  // @ts-ignore
  // const onMove = throttle((object, position) => {
  //   const data = {
  //     type: object.type,
  //     key: object.key,
  //     position
  //   };
  //   console.log(data);
  //   socket.emit("move object", data);
  // }, 150);

  if (!readyState) {
    return <div>Not ready</div>;
  }

  const objects = byType(state);

  return (
    <ObjectContext.Provider value={state}>
      <Cursors cursors={objects.user} />
      <Cards cards={objects.card} dispatch={dispatch} />
    </ObjectContext.Provider>
  );

  // return (
  //   <div className={styles.board}>
  //     <div>
  //       {cursors.map(({ position, key }, index) => (
  //         <Cursor key={key} index={index} position={position} />
  //       ))}
  //     </div>
  //     <div>
  //       {decks.map(deck => {
  //         // @ts-ignore
  //         return (
  //           <div key={deck.name}>
  //             {deck.cards.map(props => (
  //               <Card
  //                 position={position[props.identifier]}
  //                 key={props.identifier}
  //                 onMove={onMove}
  //                 {...props}
  //               />
  //             ))}
  //           </div>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );
};
