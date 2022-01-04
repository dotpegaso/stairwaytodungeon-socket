"use strict";

const express = require("express");
const socketIO = require("socket.io");

const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));

  socket.on("diceroll", (diceroll) => {
    socket.broadcast.emit("diceroll", diceroll);
  });

  socket.on("characters", () => {
    socket.broadcast.emit("characters");
  });

  socket.on("dayPeriodChange", (dayPeriodChange) => {
    socket.broadcast.emit("dayPeriodChange", dayPeriodChange);
  });

  socket.on("connectedCharacter", (characterId) => {
    socket.broadcast.emit("connectedCharacter", characterId);
  });
});

setInterval(() => io.emit("time", new Date().toTimeString()), 1000);
