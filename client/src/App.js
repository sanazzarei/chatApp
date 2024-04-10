import { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join-room", room);
      setJoined(true);
    }
  };

  return (
    <div className="App">
      {!joined && (
        <>
          <h3>Let's Chat</h3>
          <div className="input-group">
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
