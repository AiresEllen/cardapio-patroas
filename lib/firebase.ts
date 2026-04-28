import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj7F799Gcc_KXys-Rqd-ij6Kzw7JlLhfs",
  authDomain: "topdrinks-200d7.firebaseapp.com",
  projectId: "topdrinks-200d7",
  storageBucket: "topdrinks-200d7.firebasestorage.app",
  messagingSenderId: "827903755756",
  appId: "1:827903755756:web:6fc2ffe43d10b1419d2cc9",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
