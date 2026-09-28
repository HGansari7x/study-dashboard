import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBkmfh240a1IBC_I10mag0qgn04Z1wDEQk",
  authDomain: "studypulse-b558c.firebaseapp.com",
  projectId: "studypulse-b558c",
  storageBucket: "studypulse-b558c.appspot.com",
  messagingSenderId: "353738770293",
  appId: "1:353738770293:web:3eee87cb88a32c8717353c",
  measurementId: "G-02C9T5V6D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});