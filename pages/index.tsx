'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Chatbox from '../components/Chatbox';
import Popup from '../components/Popup';

export default function Home() {
  const router = useRouter();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean | null>(null);

  // Efisienkan pengambilan data atau perubahan status autentikasi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setPopupOpen(true);
        setIsUserAuthenticated(true); // Menyimpan status autentikasi
      }
    });

    return () => unsubscribe();
  }, [router]);

  const closePopup = () => {
    setPopupOpen(false);
  };

  // Caching untuk status autentikasi user di localStorage
  useEffect(() => {
    const storedUserStatus = localStorage.getItem('userStatus');
    if (storedUserStatus === 'authenticated') {
      setIsUserAuthenticated(true);
      setPopupOpen(true);
    }
  }, []);

  // Menggunakan loading sementara jika status autentikasi belum diperoleh
  if (isUserAuthenticated === null) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Loading...</h1>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Selamat datang di Teman Lama Chatbot!
      </h1>
      <Chatbox />
      <Popup isOpen={isPopupOpen} onClose={closePopup} />
    </main>
  );
}
