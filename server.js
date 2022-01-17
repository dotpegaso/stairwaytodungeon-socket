"use strict";

const express = require("express");
const fs = require("fs");
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

  socket.on("characters", (entry) => {
    socket.broadcast.emit("characters", entry);
  });

  socket.on("dayPeriodChange", (dayPeriodChange) => {
    socket.broadcast.emit("dayPeriodChange", dayPeriodChange);
  });

  socket.on("connectedCharacter", (characterId) => {
    socket.broadcast.emit("connectedCharacter", characterId);
  });

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  socket.on("imageUpload", (image) => {
    const splitted = image.split(";base64,");
    const format = splitted[0].split("/")[1];
    const final = fs.writeFileSync("./image." + format, splitted[1], {
      encoding: "base64",
    });

    socket.broadcast.emit("imageUpload", final);
  });
});

setInterval(() => io.emit("time", new Date().toTimeString()), 1000);
