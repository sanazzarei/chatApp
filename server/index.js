const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const { Server } = require("socket.io");

app.use(cors());
// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Upload files to the "uploads" directory
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user${socket.id} Connected`);
  socket.on("join-room" , (data) =>{
    socket.join(data);
    console.log(`user ${socket.id} joined  room ${data}`);
  });
  
  
  socket.on("send_message" , (data)=>{
socket.to(data.room).emit("receive_message" , data)  });

 socket.on("send_file", (fileData) => {
   console.log("Received file:", fileData);
 });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} Disconnected`);
  });
});

server.listen(3001, () => {
  console.log("server is running...");
});
