import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();
// Add required Google Sheets and Google Drive scopes
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

// Flag to indicate if we are in the middle of a sign-in flow.
let isSigningIn = false;
// Cache the access token in memory.
let cachedAccessToken: string | null = null;

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Trigger a failure callback so the consumer knows we need a fresh sign-in to get the token
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Must be called from a button click or user interaction
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (isSigningIn) {
    console.warn('[GoogleAuth] Sign-in already in progress. Ignoring duplicate request.');
    return null;
  }

  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    
    // Check if the error is due to iframe security constraints or popup blocking
    const errMsg = error?.message || String(error);
    if (errMsg.includes('cancelled-popup-request') || errMsg.includes('popup-closed-by-user')) {
      throw new Error(
        'Anmeldung abgebrochen oder blockiert. Da die App in einer sicheren AI Studio Vorschau (iframe) läuft, blockieren Browser oft Google-Anmeldefenster. Bitte klicken Sie unten auf "In neuem Tab öffnen" und versuchen Sie es dort noch einmal.'
      );
    } else if (errMsg.includes('auth/internal-error') || errMsg.includes('network-request-failed')) {
      throw new Error(
        'Interner Authentifizierungsfehler. Dies wird meist durch Drittanbieter-Cookie-Blockaden im AI Studio iframe verursacht. Bitte öffnen Sie die Anwendung in einem neuen Tab, um die Anmeldung erfolgreich abzuschließen.'
      );
    }
    
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};
