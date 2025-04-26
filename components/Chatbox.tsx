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
  const [isLoading, setIsLoading] = useState(false); // State untuk loading status

  // Menyimpan pesan ke Firestore
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

  // Fungsi untuk mengirim pesan
  const handleSendMessage = async () => {
    if (!input.trim() || !genAI) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]); // Menambahkan pesan pengguna langsung ke UI
    await saveMessage(input, 'user'); // Menyimpan pesan pengguna ke Firestore
    setInput(''); // Kosongkan input setelah pesan dikirim

    setIsLoading(true); // Menandakan bahwa AI sedang memproses

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent(input);
      const response = result.response;
      const text = response.text(); // Ambil teks balasan dari model

      const botMessage: Message = { text, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]); // Menambahkan balasan bot ke UI
      await saveMessage(text, 'bot'); // Menyimpan pesan bot ke Firestore
    } catch (error) {
      console.error('Gagal mendapatkan jawaban dari Gemini:', error);
      const errorMessage: Message = { text: 'Maaf, terjadi kesalahan.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]); // Menampilkan pesan error dari bot
    } finally {
      setIsLoading(false); // Menandakan bahwa AI sudah selesai memproses
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
              className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="message bot">Bot sedang memproses...</div>
          </div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Ketik pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? 'Mengirim...' : 'Kirim'}
        </button>
      </div>
    </div>
  );
}
