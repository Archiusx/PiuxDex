import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDAwty9lfGsj-hAf1QffMJLtvUfhdd_SPI",
  authDomain: "loginx-897b3.firebaseapp.com",
  databaseURL: "https://loginx-897b3-default-rtdb.firebaseio.com",
  projectId: "loginx-897b3",
  storageBucket: "loginx-897b3.firebasestorage.app",
  messagingSenderId: "380291415413",
  appId: "1:380291415413:web:6d222db905e4457e29e73c",
  measurementId: "G-BM6PMDKN5V"
};

const app = initializeApp(firebaseConfig);

// In some environments, long polling works better than WebSockets
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const auth = getAuth(app);
