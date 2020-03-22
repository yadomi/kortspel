import React, { useState, Children } from "react";
import styles from "./Movable.module.css";

interface Props {
  onMove: (position: [number, number]) => void;
  children: any;
  position: [number, number];
}

export default ({ onMove, position, ...props }: Props) => {
  const [isMouseDown, setMouseDown] = useState(false);
  const [isMoving, setMoving] = useState(false);
  const [origin, setOrigin] = useState([0, 0]);

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { offsetX, offsetY } = event.nativeEvent;

    setOrigin([offsetX, offsetY]);
    setMouseDown(true);
  };

  const onMouseUp = () => {
    if (!isMouseDown && !isMoving) return;

    setMouseDown(false);
    setMoving(false);
  };

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMouseDown && !isMoving) {
      setMoving(true);
      return;
    }

    if (!isMoving) return;

    const [originX, originY] = origin;
    const { pageX, pageY } = event;

    const position = [pageX - originX, pageY - originY] as Props["position"];
    console.log(position);

    onMove(position);
  };

  const style = {
    zIndex: isMoving ? 1 : 0,
    transform: `translate(${position[0]}px, ${position[1]}px)`
  };

  console.log({ style });

  return (
    <div
      className={styles.movable}
      data-is-moving={isMoving}
      style={style}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {props.children}
    </div>
  );
};
