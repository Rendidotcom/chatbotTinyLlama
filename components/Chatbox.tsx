'use client';

import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Path Firestore-mu sudah benar
import { GoogleGenerativeAI } from '@google/generative-ai';

// Tipe pesan chat
interface Message {
  text: string;
  sender: 'user' | 'bot';
}

// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyDRBgtlKtbBSmWbCO-LoETQ5O1SfFQn9X4'); // GANTI dengan API Key kamu!

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Halo! Apa yang bisa saya bantu?', sender: 'bot' },
  ]);
  const [input, setInput] = useState<string>('');

  // Simpan pesan ke Firestore
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

  // Fungsi untuk mendapatkan jawaban dari Gemini
  const getGeminiReply = async (userInput: string): Promise<string> => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(userInput);
      const response = await result.response;
      const text = response.text();
      return text.trim();
    } catch (error) {
      console.error('Gagal mendapatkan jawaban dari Gemini:', error);
      return 'Maaf, terjadi kesalahan saat menghubungi server.';
    }
  };

  // Kirim pesan
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: 'user' };
    const botPlaceholder: Message = { text: 'Tunggu sebentar...', sender: 'bot' };

    setMessages((prev) => [...prev, userMessage, botPlaceholder]);
    await saveMessage(input, 'user');
    setInput('');

    try {
      const reply = await getGeminiReply(input);

      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 && msg.sender === 'bot'
            ? { ...msg, text: reply }
            : msg
        )
      );
      await saveMessage(reply, 'bot');
    } catch (error) {
      console.error('Error saat mengirim pesan:', error);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-4">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg text-white break-words ${
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
          className="flex-1 p-3 border rounded-l-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
