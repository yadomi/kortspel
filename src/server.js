const Hapi = require("@hapi/hapi");
const socketio = require("socket.io");
const { v4: uuid } = require("uuid");
const { mergeRight, reduce, assoc } = require("ramda");

const presets = {
  uno: require("./presets/Uno/index")
};

const initialize = preset => {
  const { card } = preset;

  return {
    ...reduce(
      (sum, value) => {
        const id = uuid();
        return assoc(
          id,
          { ...value, identifier: id, type: "card", position: [0, 0] },
          sum
        );
      },
      {},
      card
    )
  };
};

const state = {
  object: {
    ...initialize(presets.uno)
  },
  socket: new Map()
};

// console.log(state.object);

const colors = require("./server/color")();

const iohandler = io => socket => {
  console.log("client connected", socket.id);

  socket.on("USER/WELCOME", userId => {
    const id = userId || uuid();
    state.socket.set(socket.id, id);

    if (!state.object[id]) {
      state.object[id] = {
        identifier: id,
        type: "user",
        color: colors.next().value,
        position: [0, 0]
      };
    }

    socket.emit("USER/WELCOME", state.object[id]);
    socket.emit("STATE/INIT", state.object);
  });

  socket.on("UPDATE/OBJECT", object => {
    const value = state.object[object.identifier];
    if (!value) return;

    state.object[object.identifier] = mergeRight(value, object);
    socket.broadcast.emit(
      "STATE/UPDATE/OBJECT",
      state.object[object.identifier]
    );
  });

  socket.on("disconnect", () => {
    state.socket.delete(socket.id);
    console.log("client disconnected", socket.id);
  });
};

const init = async () => {
  const server = Hapi.server({
    port: 4000,
    host: "0.0.0.0"
  });

  const io = socketio(server.listener);
  io.on("connection", iohandler(io));
  await server.start();

  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
