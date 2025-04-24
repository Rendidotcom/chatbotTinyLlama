import React, { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState<any[]>([
    { text: 'Halo! Apa yang bisa saya bantu?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { text: input, sender: 'user' },
        { text: 'Tunggu sebentar...', sender: 'bot' },
      ]);
      setInput('');

      // Simulasi bot jawab
      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg, index) =>
            index === prevMessages.length - 1 && msg.sender === 'bot'
              ? { ...msg, text: 'Ini jawaban dari chatbot' }
              : msg
          )
        );
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-80 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-4">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg text-white ${
                message.sender === 'user' ? 'bg-blue-500' : 'bg-gray-400'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-3">
        <input
          type="text"
          placeholder="Ketik pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 p-3 border rounded-l-lg border-gray-300"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
