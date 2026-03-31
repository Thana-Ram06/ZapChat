import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDNZRYqrHYVDSCTQBNrfsdAaNeFdGr0_5o",
  authDomain: "zapchat-7bceb.firebaseapp.com",
  projectId: "zapchat-7bceb",
  storageBucket: "zapchat-7bceb.firebasestorage.app",
  messagingSenderId: "305005759246",
  appId: "1:305005759246:web:ede6b16524bbc99e66255f",
  measurementId: "G-KB5FRVWP0R",
};

export const app = initializeApp(firebaseConfig);

export const analytics = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);

export default app;
