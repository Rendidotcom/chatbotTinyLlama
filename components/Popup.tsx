'use client';

import { useEffect, useState } from 'react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Popup({ isOpen, onClose }: PopupProps) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-80 transform transition-transform duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">Selamat datang di TinyLlama Chatbot!</h2>
        <p className="text-gray-600 mt-4 text-center">Nikmati pengalaman chatting yang seru!</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
