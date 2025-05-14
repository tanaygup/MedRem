// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQV5dab2vwU1rdlxsfaSMTDtfgP0kOP2Q",
  authDomain: "medrem-fbcb0.firebaseapp.com",
  projectId: "medrem-fbcb0",
  storageBucket: "medrem-fbcb0.firebasestorage.app",
  messagingSenderId: "954226199500",
  appId: "1:954226199500:web:6c134554da50db66dd6b69",
  measurementId: "G-XW9DFRX8H7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
let messaging= null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  messaging = getMessaging(app);
}
export const db = getFirestore(app);
export { messaging };

