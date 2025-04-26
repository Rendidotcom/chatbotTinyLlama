// pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Chatbox from '../components/Chatbox';
import Popup from '../components/Popup';

export default function Home() {
  const router = useRouter();
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setPopupOpen(true); // Menampilkan pop-up ketika pengguna masuk
      }
    });

    return () => unsubscribe();
  }, [router]);

  const closePopup = () => {
    setPopupOpen(false); // Menutup pop-up
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Selamat datang di TinyLlama Chatbot!
      </h1>
      <Chatbox />
      <Popup isOpen={isPopupOpen} onClose={closePopup} />
    </div>
  );
}
