// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });

// const app = require("./app");
// const express = require("express");
// const httpServer = require("http").createServer(app);

// const io = require("socket.io")(httpServer);

// // var io = require("socket.io").listen(server);
// io.on("connection", function (socket) {
//   console.log("Client connected.");

//   // Example of receiving a message from client
//   socket.on("message", (data) => {
//     console.log("Message from client:", data);
//   });

//   // Disconnect listener
//   socket.on("disconnect", function () {
//     console.log("Client disconnected.");
//   });
// });
// mongoose
//   .connect(process.env.DATABASE)
//   .then(() => console.log("DB connection successful !"));

// const port = 3000;

// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

// httpServer.listen(console.log(`server2 running on port 8000...`), 3000);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");
const http = require("http");
const express = require("express");

// Initialize HTTP server with Express app
const httpServer = http.createServer(app);

// Initialize Socket.IO server on the HTTP server
const io = require("socket.io")(httpServer);

io.on("connection", function (socket) {
  console.log("Client connected.");

  // Example of receiving a message from client
  socket.on("message", (data) => {
    console.log("Message from client:", data);
  });

  // Disconnect listener
  socket.on("disconnect", function () {
    console.log("Client disconnected.");
  });
});

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error("DB connection error:", err));

const port = 3000;

// Start the HTTP server (which also includes the Socket.IO server)
httpServer.listen(port, () => {
  console.log(`App running on port ${port}...`);
  console.log(`Socket.IO server running on port ${port}...`);
});
global.io = io;
