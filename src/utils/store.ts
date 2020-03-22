import {
  assoc,
  compose,
  groupBy,
  prop,
  values,
  reduce,
  mergeRight
} from "ramda";

const types = ["card", "user"];
const shape = reduce((sum, v) => assoc(v, [], sum), {}, types);

interface types {
  card: Array<any>;
  user: Array<User>;
}

export const byType: (state: any) => types = compose(
  // @ts-ignore
  mergeRight(shape),
  // @ts-ignore
  groupBy(prop("type")),
  values
);
