import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  appId: "your-app-id",
  messagingSenderId: "your-sender-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
