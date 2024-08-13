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

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser does not support speech recognition. Try using Google Chrome.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("Voice recognition started. Speak into the microphone.");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("You said: " + transcript);
      setUserInput(transcript);
      handleSend();
    };

    recognition.onerror = (event) => {
      console.error("Error occurred in recognition: " + event.error);
    };

    recognition.onend = () => {
      console.log("Voice recognition ended.");
    };

    recognition.start();
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
        <div className="button-container">
          <button onClick={handleSend}>Send</button>
          <button onClick={handleVoiceInput}>🎤 Speak</button>
        </div>
      </div>
    </div>
  );
}

export default App;
