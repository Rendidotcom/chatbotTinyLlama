// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyBvcXsaTy4xl4hZdLmGkDVJRJbF44js1og',
  authDomain: 'chatbottinyllama.firebaseapp.com',
  projectId: 'chatbottinyllama',
  storageBucket: 'chatbottinyllama.firebasestorage.app',
  messagingSenderId: '836242896425',
  appId: '1:836242896425:web:003431a2fbf89538650e38'
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Buat instance Auth dan Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export supaya bisa dipakai di file lain
export { auth, db };