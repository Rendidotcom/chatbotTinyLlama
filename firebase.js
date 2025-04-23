"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = exports.auth = void 0;
// Import modul Firebase v9 secara terpisah
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
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
const app = (0, app_1.initializeApp)(firebaseConfig);
// Dapatkan auth dan firestore
exports.auth = (0, auth_1.getAuth)(app);
exports.firestore = (0, firestore_1.getFirestore)(app);
