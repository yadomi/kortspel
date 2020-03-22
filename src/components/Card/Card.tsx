import React from "react";
import styles from "./Card.module.css";
import Movable from "../Movable/Movable";

export const Side = {
  FRONT: "front" as Face,
  BACK: "back" as Face
};

export interface Props {
  onFlip: (identifier: Card["identifier"]) => void;
  onMove: (identifier: Card["identifier"], position: Card["position"]) => void;
}

export default ({
  onFlip,
  onMove,
  faces,
  visibility,
  ...props
}: Card & Props) => {
  const Faces = {
    [Side.FRONT]: () => <img alt="Front face" src={faces[Side.FRONT]} />,
    [Side.BACK]: () => <img alt="Back face" src={faces[Side.BACK]} />
  };

  const Face = Faces[visibility];

  const handleDoubleClick = () => {
    onFlip(props.identifier);
  };

  const handleMove = (position: Card["position"]) => {
    onMove(props.identifier, position);
  };

  return (
    <Movable onMove={handleMove} position={props.position}>
      <div
        data-visibility={visibility}
        className={styles.card}
        onDoubleClick={handleDoubleClick}
      >
        <Face />
      </div>
    </Movable>
  );
};
