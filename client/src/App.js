import { useState } from 'react';
import './App.css';
import io from 'socket.io-client';

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
    <label> Name: </label>
    <input type="text" placeholder='type your name' onChange={(event)=>{setUsername(event.target.value)}}/>
    <label>Chat Room Id:</label>
    <input type="text" placeholder='type the chat room id' onChange={(event) => {setRoom(event.target.value)}} />
    <button onClick={joinRoom}>Join The Room</button>

    </div>
  );
}

export default App;
