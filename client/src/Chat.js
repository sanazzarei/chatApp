import {useState , useEffect} from "react"
import ScrollToBottom from "react-scroll-to-bottom";
function Chat({socket , username, room}){
    const[currentMessage,setCurrentMessage]= useState("");
    const [messageList, setMessageList]= useState([]);
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
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div>
    );
}
export default Chat