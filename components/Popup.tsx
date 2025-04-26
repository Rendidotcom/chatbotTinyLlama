// components/Popup.tsx
import React, { useEffect, useState } from 'react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShow(true);  // Animasi fade in
    } else {
      setTimeout(() => setShow(false), 300);  // Setelah animasi selesai, sembunyikan
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 transition-all ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white p-6 rounded-lg shadow-lg w-80 transform transition-transform ${isOpen ? 'scale-100' : 'scale-95'}`}>
        <h2 className="text-xl font-bold text-gray-800">Selamat datang di TinyLlama Chatbot!</h2>
        <p className="text-gray-600 mt-4">Nikmati pengalaman chatting yang seru!</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default Popup;
