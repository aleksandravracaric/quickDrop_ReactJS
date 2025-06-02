import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, doc, getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import { dblClick } from "@testing-library/user-event/dist/click";


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

const firestoreDB = getFirestore(app);


export function getFilesFirestoreReference() {
    return collection(firestoreDB, "files")
}

export function getFileIdFirestoreReference(fileId) {
    return doc(firestoreDB, "files", fileId, "file")
}

const storage = getStorage(app);

export function getFilesStorageReference(fileName, sessionId) {
    return ref(storage, `uploads/${sessionId}/${fileName}`);
}
