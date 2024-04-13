import {useState , useEffect} from "react"
import ScrollToBottom from "react-scroll-to-bottom"
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

function Chat({socket , username, room}){
    const[currentMessage,setCurrentMessage]= useState("");
    const [messageList, setMessageList]= useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const sendMessage = async () =>{
        if(currentMessage.trim() !== ""){
          const messageData = {
            room: room,
            author: username,
            message: currentMessage,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
          };
          await socket.emit("send_message", messageData);
          setMessageList((list) => [...list, messageData]);
          setCurrentMessage(""); // Clear the input field
        }
    }
  useEffect(() => {
    const receiveMessage = (data) => {
      setMessageList((list)=>[...list, data]);
    };

    socket.on("receive_message", receiveMessage);

    return () => {
      socket.off("receive_message", receiveMessage);
    };
  }, [socket]);

   const toggleEmojiPicker = () => {
     setShowEmojiPicker(!showEmojiPicker);
   };


    return (
      <div className="chat-container">
        <div className="chat-header">
          <p>Live Chat</p>
        </div>
        <div className="chat-body">
          <ScrollToBottom>
            {messageList.map((messageContent) => {
              return (
                <div
                  className="message"
                  id={username === messageContent.author ? "you" : "other"}
                >
                  <div className="message-sender">{messageContent.author}</div>
                  <div className="message-content">
                    {messageContent.message}
                  </div>
                  <div className="message-time">{messageContent.time}</div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            placeholder="Type your message..."
            value={currentMessage}
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button id="emoji-btn" onClick={toggleEmojiPicker}>&#x1F642;</button>{" "}
          {showEmojiPicker && (
            <Picker
              data={data}
              onEmojiSelect={(emoji) =>
                setCurrentMessage(currentMessage + emoji.native)
              }
              set="apple"
              showPreview={false}
            />
          )}
          <button onClick={sendMessage}>send</button>
        </div>
      </div>
    );
}
export default Chat