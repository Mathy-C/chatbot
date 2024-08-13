import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSend = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (userInput.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userInput },
      ]);

      try {
        const response = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userInput }),
        });

        const data = await response.json();

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: data.message },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Error: Unable to get a response from the server." },
        ]);
      }

      setUserInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend(e);
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
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
