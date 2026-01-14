import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQ0JOT26VAlvbhYHLVaoTqd6DvENxyI9k",
  authDomain: "snapdeal-1bf03.firebaseapp.com",
  projectId: "snapdeal-1bf03",
  storageBucket: "snapdeal-1bf03.firebasestorage.app",
  messagingSenderId: "584680612305",
  appId: "1:584680612305:web:db5ff92ff2a67e84ac40f0",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);