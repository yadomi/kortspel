import React from "react";
import { userId } from "../../utils/user";

const Child = ({ position, color, me }: User & { me: boolean }) => {
  const style = {
    position: "absolute",
    transform: `translate(${position[0].toString()}px, ${position[1].toString()}px)`,
    border: `3px solid ${color}`,
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    zIndex: 1
  } as React.CSSProperties;

  if (me) {
    return null;
  }

  return <div style={style} />;
};

export default ({ cursors }: { cursors: Array<User> }) => {
  const id = userId();

  return (
    <div>
      {cursors.map(cursor => (
        <Child
          me={id === cursor.identifier}
          key={cursor.identifier}
          {...cursor}
        />
      ))}
    </div>
  );
};
