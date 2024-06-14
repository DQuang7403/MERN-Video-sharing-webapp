// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "video-sharing-webapp-e1531.firebaseapp.com",
  projectId: "video-sharing-webapp-e1531",
  storageBucket: "video-sharing-webapp-e1531.appspot.com",
  messagingSenderId: "160897088702",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});
export const auth = getAuth();
export default app;

