// ../sendMessage.ts
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface Message {
  text: string;
  userId: string;
}

export async function sendMessage(message: Message) {
  try {
    const messagesRef = collection(db, 'messages'); // db harus instance Firestore!
    await addDoc(messagesRef, {
      text: message.text,
      userId: message.userId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Gagal menyimpan pesan:', error);
    throw error;
  }
}
