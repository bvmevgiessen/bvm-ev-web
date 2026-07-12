import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

let apiKey = import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_API_KEY || firebaseAppletConfig.apiKey;

if (!apiKey) {
  console.warn("VITE_FIREBASE_API_KEY is not set. Using a placeholder API key to prevent frontend runtime crashes.");
  apiKey = "AIzaSy_Placeholder_PleaseConfigureYourFirebaseCredentials";
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use the databaseId from the applet config if we are falling back to the AI Studio project
const databaseId = !import.meta.env.VITE_FIREBASE_PROJECT_ID ? firebaseAppletConfig.firestoreDatabaseId : undefined;

export const db = databaseId 
  ? initializeFirestore(app, { experimentalForceLongPolling: true }, databaseId)
  : initializeFirestore(app, { experimentalForceLongPolling: true });

