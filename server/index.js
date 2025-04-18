const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);
let users = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
})

io.on("connection", (socket) => {
  socket.on('set username', (username) => {
    socket.username = username;
    users.push(username);
    io.emit('usernames', users);
  });
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    users = users.filter(u => u !== socket.username);
    io.emit("usernames", users);
  });
  socket.on("message", (data) => {
    io.emit("message", {
      username: socket.username,
      message: data.message
    });
  });
});

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
