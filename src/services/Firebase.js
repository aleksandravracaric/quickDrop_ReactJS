import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const apiKeyFirebase = process.env.REACT_APP_FIREBASE_API_KEY

const firebaseConfig = {
    apiKey: `${apiKeyFirebase}`,
    authDomain: "a-quickdrop.firebaseapp.com",
    projectId: "a-quickdrop",
    storageBucket: "a-quickdrop.firebasestorage.app",
    messagingSenderId: "743274116486",
    appId: "1:743274116486:web:e54624e2fa30ccb561a807",
    measurementId: "G-20JQ9YTMJK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);