import { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./Chat";
import user_img from './images/user.png'
import axios from "axios";


const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState({});
  const handleSelectFile = (e) => setFile(e.target.files[0]);
  const handleUpload = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("my_file", file);
      const res = await axios.post("http://localhost:3001/upload", data);
      setRes(res.data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async  () => {
    if (username !== "" && room !== "") {
      socket.emit("join-room", room);
      setJoined(true);
      await handleUpload();
    }
  };

     const handleUserImageClick = () => {
       const fileInput = document.createElement("input");
       fileInput.type = "file";
       fileInput.accept= "image/*";
       fileInput.multiple="false";
       fileInput.style.display = "none";
       fileInput.addEventListener("change", handleSelectFile);
       document.body.appendChild(fileInput);
       fileInput.click();
     };

  return (
    <div className="App">
      {!joined && (
        <>
          <div className="input-group">
            <div className="input-container">
              <img src={user_img} alt="user image" />
              <p onClick={handleUserImageClick}>Edit Profile</p>
            </div>
            <code>
              {Object.keys(res).length > 0
                ? Object.keys(res).map((key) => (
                    <p className="output-item" key={key}>
                      <span>{key}:</span>
                      <span>
                        {typeof res[key] === "object" ? "object" : res[key]}
                      </span>
                    </p>
                  ))
                : null}
            </code>
            <div className="input-container">
              <label>Name:</label>
              <input
                type="text"
                placeholder="Type your name"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
            </div>
            <div className="input-container">
              <label>Chat Room Id:</label>
              <input
                type="text"
                placeholder="Type the chat room id"
                onChange={(event) => {
                  setRoom(event.target.value);
                }}
              />
            </div>
          </div>
          <button onClick={joinRoom}>Join The Room</button>
        </>
      )}
      {joined && <Chat socket={socket} username={username} room={room} />}
    </div>
  );
}

export default App;
