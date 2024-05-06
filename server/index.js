require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Server } = require("socket.io");

app.use(cors());



// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Upload files to the "uploads" directory
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const profile_storage = new multer.memoryStorage();
const upload = multer({ storage: profile_storage });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.post("/upload", upload.single("my_file"), async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    res.json(cldRes);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
});

io.on("connection", (socket) => {
  console.log(`user${socket.id} Connected`);
  socket.on("join-room", (data) => {
    socket.join(data);
    console.log(`user ${socket.id} joined  room ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("send_file", (fileData) => {
    console.log("Received file:", fileData);
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} Disconnected`);
  });
});



//file-uploading in Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "image",
  });
  return res;
}


server.listen(3001, () => {
  console.log("server is running...");
});