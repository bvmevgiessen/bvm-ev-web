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

// Resolve the databaseId:
// 1. Check if the project is an AI Studio workspace project (using firebaseConfig.projectId or starting with gen-lang-client-).
// 2. If it is, we MUST use the dedicated database ID from the config file.
// 3. Otherwise, for custom external projects, use VITE_FIREBASE_DATABASE_ID if provided.
// 4. If the database ID resolves to the custom project's ID itself, reset it to undefined to use "(default)".
const currentProjectId = firebaseConfig.projectId;
const isAIStudioProject = 
  currentProjectId === "composite-advice-ljcsn" || 
  (currentProjectId && currentProjectId.startsWith("gen-lang-client-"));

let databaseId: string | undefined = undefined;

if (isAIStudioProject) {
  databaseId = firebaseAppletConfig.firestoreDatabaseId;
} else {
  databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || undefined;
  if (databaseId === currentProjectId) {
    databaseId = undefined;
  }
}

export const db = databaseId 
  ? initializeFirestore(app, { experimentalForceLongPolling: true }, databaseId)
  : initializeFirestore(app, { experimentalForceLongPolling: true });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

