import React, { useContext } from "react";
import Card, { Side, Props as CardProps } from "../Card/Card";
import { SocketContext } from "../App/App";
import { ObjectContext } from "../Board/Board";
import throttle from "lodash.throttle";

interface Props {
  cards: Array<Card>;
  dispatch: React.Dispatch<{ type: string; payload: {} }>;
}

export default ({ cards, dispatch }: Props) => {
  const socket = useContext(SocketContext);
  const object = useContext(ObjectContext);

  const emit = throttle(payload => socket.emit("UPDATE/OBJECT", payload), 250);

  const update = (payload: any) => {
    emit(payload);
    dispatch({ type: "STATE/UPDATE/OBJECT", payload });
  };

  const handleFlip = (identifier: string) => {
    const card = object[identifier] as Card;

    const payload = {
      identifier,
      visibility: card?.visibility === Side.FRONT ? Side.BACK : Side.FRONT
    };

    update(payload);
  };

  const handleMove: CardProps["onMove"] = (identifier, position) => {
    const payload = {
      identifier,
      position
    };
    update(payload);
  };

  console.log(cards);

  return (
    <div>
      {cards.map(card => (
        <Card
          onFlip={handleFlip}
          onMove={handleMove}
          key={card.identifier}
          {...card}
        />
      ))}
    </div>
  );
};
