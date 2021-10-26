const { Server } = require("socket.io");
const express = require("express");

const PORT = 3000;
const INDEX = "/index.html";

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("diceroll", (diceroll) => {
  console.log("diceroll", diceroll);
  socket.broadcast.emit("diceroll", diceroll);
});
