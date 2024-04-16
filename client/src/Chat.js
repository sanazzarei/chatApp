import { useState, useEffect, useRef } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null); // Define emojiPickerRef here

  const sendMessage = async () => {
  if (currentMessage.trim() !== "" || selectedFile !== null) {
    // If there's a selected file, upload it first
    if (selectedFile) {
      await handleFileUpload();
    }
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        file: selectedFile,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage(""); // Clear the input field
      setSelectedFile(null); // Reset selected file after sending
    }
  };

  useEffect(() => {
const receiveMessage = (data) => {
  if (data.message) {
    // If the received data is a message
    setMessageList((list) => [...list, data]);
  } else if (data.fileData) {
    // If the received data is a file
    setMessageList((list) => [
      ...list,
      {
        fileData: data.fileData,
        author: data.author,
        time: data.time,
        fileName: data.fileName,
      },
    ]);
  }
};


    socket.on("receive_message", receiveMessage);

    return () => {
      socket.off("receive_message", receiveMessage);
    };
  }, [socket]);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        emojiButtonRef.current &&
        emojiPickerRef.current && // Corrected to use emojiPickerRef
        !emojiButtonRef.current.contains(event.target) &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Function to handle file upload
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileData = event.target.result; // File data as a Base64 string
        await socket.emit("send_file", {
          fileData,
          fileName: selectedFile.name,
        });
        // Add the uploaded file as a message to the UI
        const messageData = {
          author: username,
          fileData,
          fileName: selectedFile.name,
          time: new Date().toLocaleTimeString(),
        };
        setMessageList((list) => [...list, messageData]);
      };
      reader.readAsDataURL(selectedFile);
    }
  };


  return (
    <div className="chat-container">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom>
          {messageList.map((messageContent) => (
            <div
              className="message"
              id={username === messageContent.author ? "you" : "other"}
              key={messageContent.time}
            >
              <div className="message-sender">{messageContent.author}</div>
              <div className="message-content">
                {messageContent.message && <p>{messageContent.message}</p>}
                {messageContent.fileName?.match(/\.(jpg|jpeg|png|gif)$/) ? (
                  <img
                    src={messageContent.fileData}
                    alt={messageContent.fileName}
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      width: messageContent.imageWidth,
                      height: messageContent.imageHeight,
                    }}
                  />
                ) : (
                  <a
                    href={messageContent.fileData}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {messageContent.fileName}
                  </a>
                )}
              </div>
              <div className="message-time">{messageContent.time}</div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type your message..."
          value={currentMessage}
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <button id="emoji-btn" onClick={toggleEmojiPicker} ref={emojiButtonRef}>
          &#x1F642;
        </button>{" "}
        <input type="file" onChange={handleFileChange} />
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="emoji-container">
            <Picker
              data={data}
              onEmojiSelect={(emoji) =>
                setCurrentMessage(currentMessage + emoji.native)
              }
              set="apple"
              showPreview={false}
            />
          </div>
        )}
        <button onClick={sendMessage}>send</button>
      </div>
    </div>
  );
}

export default Chat;
