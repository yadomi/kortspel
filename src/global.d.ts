interface GlobalState {
  card: Array<Card>;
  user: Array<User>;
}

interface Base {
  identifier: string;
  type: string;
}

interface User extends Base {
  position: [number, number];
  color: string;
}

type Face = keyof Card["faces"];

interface Card extends Base {
  position: [number, number];
  deck: string;
  faces: {
    front: string;
    back: string;
  };
  visibility: Face;
}
