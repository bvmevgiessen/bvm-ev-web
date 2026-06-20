import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDPewCo3EHqEHtgydawxpSWWsF1PsRPeik",
  authDomain: "gen-lang-client-0427689132.firebaseapp.com",
  projectId: "gen-lang-client-0427689132",
  storageBucket: "gen-lang-client-0427689132.firebasestorage.app",
  messagingSenderId: "142962483919",
  appId: "1:142962483919:web:7e5cc486df4d2795a4cdba"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);