import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { safeStorage } from './SafeStorage';

const DEFAULT_FIREBASE_CONFIG = {
  projectId: "ai-studio-07e2d538-c938-490a-b092-7a517f5e2308",
  appId: "1:753309057428:web:bvm-ev-app",
  storageBucket: "ai-studio-07e2d538-c938-490a-b092-7a517f5e2308.appspot.com",
  authDomain: "ai-studio-07e2d538-c938-490a-b092-7a517f5e2308.firebaseapp.com",
  messagingSenderId: "753309057428",
  firestoreDatabaseId: "ai-studio-07e2d538-c938-490a-b092-7a517f5e2308"
};

let apiKey = import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_API_KEY || "";

if (!apiKey) {
  console.warn("VITE_FIREBASE_API_KEY is not set. Using a placeholder API key to prevent frontend runtime crashes.");
  apiKey = "AIzaSy_Placeholder_PleaseConfigureYourFirebaseCredentials";
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Resolve the databaseId:
// To ensure we strictly use the single standard default database, databaseId is undefined by default.
// This prevents confusion and database mismatch issues.
const currentProjectId = firebaseConfig.projectId;

let databaseId: string | undefined = undefined;

const savedDbId = safeStorage.getItem('bvm_firebase_database_id');

if (savedDbId !== null) {
  databaseId = (savedDbId === 'default' || savedDbId === '') ? undefined : savedDbId;
} else if (import.meta.env.VITE_FIREBASE_DATABASE_ID) {
  const envDbId = import.meta.env.VITE_FIREBASE_DATABASE_ID;
  if (envDbId !== 'default' && envDbId !== '(default)' && envDbId !== 'default-db') {
    databaseId = envDbId;
  }
} else if (DEFAULT_FIREBASE_CONFIG.firestoreDatabaseId) {
  const cfgDbId = DEFAULT_FIREBASE_CONFIG.firestoreDatabaseId;
  if (cfgDbId !== 'default' && cfgDbId !== '(default)' && cfgDbId !== 'default-db') {
    databaseId = cfgDbId;
  }
}

console.info("[Firebase] Configuration initialized:", {
  projectId: currentProjectId,
  databaseId: databaseId || "(default)",
  isAIStudioProject: currentProjectId === "composite-advice-ljcsn" || (currentProjectId && currentProjectId.startsWith("gen-lang-client-")),
  hasApiKey: !!firebaseConfig.apiKey,
  apiKeySnippet: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.slice(0, 8)}...` : "none"
});

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