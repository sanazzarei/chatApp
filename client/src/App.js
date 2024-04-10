import { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Chat from './Chat';

const socket = io.connect("http://localhost:3001");
function App() {
  const [username,setUsername] = useState("");
  const [room,setRoom] = useState("");
  const joinRoom = () =>{
    if(username !== "" && room !== ""){
      socket.emit("join-room" , room);
    }
  }
  return (
    <div className="App">
      <h3>let's Chat</h3>
      <div className="input-group">
        <div className="input-container">
          <label> Name: </label>
          <input
            type="text"
            placeholder="type your name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </div>
        <div className="input-container">
          <label>Chat Room Id:</label>
          <input
            type="text"
            placeholder="type the chat room id"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
        </div>
      </div>
      <button onClick={joinRoom}>Join The Room</button>
      <Chat socket={socket} username={username} room={room} />
    </div>
  );
}

export default App;
