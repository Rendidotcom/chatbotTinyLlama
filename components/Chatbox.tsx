'use client';

import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

// Inisialisasi Gemini API
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Halo! Apa yang bisa saya bantu?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

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
    if (!input.trim() || !genAI) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    await saveMessage(input, 'user');
    setInput('');

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent(input);
      const response = result.response;
      const text = response.text();

      const botMessage: Message = { text, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
      await saveMessage(text, 'bot');
    } catch (error) {
      console.error('Gagal mendapatkan jawaban dari Gemini:', error);
      const errorMessage: Message = { text: 'Maaf, terjadi kesalahan.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`message ${
                message.sender === 'user' ? 'user' : 'bot'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Ketik pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>
          Kirim
        </button>
      </div>
    </div>
  );
}
