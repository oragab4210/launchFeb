const express = require("express");
const models = require("./models");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./services/auth");
const MongoStore = require("connect-mongo");
const schema = require("./schema/schema");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const socketIO = require("socket.io");
const bcrypt = require("bcrypt");
const path = require("path");
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  // cors: true,
  // origins: [`${process.env.CLIENT_URL}:4000`],
  cors: {
    origin: "*",
  },
});

/* ------------------------------- Mongo Setup ------------------------------ */
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    authSource: "admin",
    retryWrites: true,
    dbName: "Final",
  })
  .then(
    () => {
      console.log("YAY Connected!");
    },
    (err) => {
      console.log("ERROR OH NOO");
    }
  )
  .catch((err) => console.log(err));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    credentials: "include",
    secret: "1234",
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      autoReconnect: true,
    }),
  })
);
/* -------------------------------- Passport -------------------------------- */
app.use(passport.initialize());
app.use(passport.session());
/* ------------------------------- cors setup ------------------------------- */
const corsOptions = {
  // origin: `${process.env.CLIENT_URL}:4000`,
  origin: `*`,
  credentials: true,
};
app.use(cors(corsOptions));

/* ----------------------------- GraphQL Options ---------------------------- */

app.use(express.json());
app.use(
  `${process.env.CLIENT_URL}:4000/graphql`,
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
/* -------------------------- Configure Production -------------------------- */
app.use(express.static("client/build"));
app.use(express.static(path.join(__dirname, "..", "client", "build")));
console.log(__dirname);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

/* -------------------------------- Socket.IO ------------------------------- */
//
const onlineUsersObjects = {};
io.on("connection", (socket) => {
  socket.on("login", (data) => {
    const onlineUsers = Object.entries(onlineUsersObjects);
    const onlineIds = Array.from(onlineUsers, (x) => x[1]);
    if (onlineIds.includes(data.userId) === false && data.userId !== null) {
      onlineUsersObjects[socket.id] = data.userId;
      io.emit("onlineUsers", onlineUsersObjects);
      console.log(onlineUsersObjects);
    } else {
      io.emit("onlineUsers", onlineUsersObjects);
    }
  });

  socket.on("refetchOnlineUsers", (data) => {
    io.emit("onlineUsers", onlineUsersObjects);
  });

  socket.on("setRoom", (data) => {
    socket.join(data);
  });

  socket.on("newMessage", (data) => {
    io.in(data.room).emit("newMessage", data);
  });

  socket.on("logout", (data) => {
    console.log("logout socket", data.socketId);
    delete onlineUsersObjects[data.socketId];
    io.emit("onlineUsers", onlineUsersObjects);
  });

  // });

  socket.on("disconnect", (data) => {
    socket.leave(data);
    socket.disconnect();

    console.log("DISCONNECTING");
    delete onlineUsersObjects[socket.id];

    io.emit("onlineUsers", onlineUsersObjects);
    console.log(onlineUsersObjects);
  });
});

/* --------------------------- RUN SERVER ON PORT --------------------------- */
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log("Listening on port: ", port);
});
