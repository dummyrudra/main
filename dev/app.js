const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();

const http = require("http");
const { Server } = require("socket.io");

require("./models/connection.db")();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:" + socket.id);

  socket.on("joinRoom", (data) => {
    socket.join(data);
  });

  socket.on("leaveRoom",(data)=>{
    socket.leave(data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:" + socket.id);
    socket.leave();
  });
});

module.exports.io = io;

require("./start/routes")(app)

module.exports = server.listen(PORT, () => {
  console.log(`serve at http://localhost:${PORT}`);
});
