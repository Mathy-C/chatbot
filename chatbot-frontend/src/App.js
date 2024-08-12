import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSend = () => {
    if (userInput.trim() !== "") {
      setMessages([...messages, { sender: "user", text: userInput }]);
      setUserInput("");
      // Logic to send message to backend will be added here
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chatbox">
          {messages.map((message, index) => (
            <div key={index} className={message.sender === "user" ? "user-message" : "bot-message"}>
              {message.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
