// C:\Users\rendi\Documents\coding\chatbot_TinyLlama\components\Chatbot.tsx
'use client';

import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // path sudah betul

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Halo! Apa yang bisa saya bantu?', sender: 'bot' },
  ]);
  const [input, setInput] = useState<string>('');

  const saveMessage = async (text: string, sender: 'user' | 'bot') => {
    try {
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        text,
        sender,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Gagal menyimpan pesan:', error);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: Message = { text: input, sender: 'user' };
      const botPlaceholder: Message = { text: 'Tunggu sebentar...', sender: 'bot' };

      setMessages((prev) => [...prev, userMessage, botPlaceholder]);
      await saveMessage(input, 'user');
      setInput('');

      setTimeout(async () => {
        const reply = 'Ini jawaban dari chatbot';
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 && msg.sender === 'bot'
              ? { ...msg, text: reply }
              : msg
          )
        );
        await saveMessage(reply, 'bot');
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
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
