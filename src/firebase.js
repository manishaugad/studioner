import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyA8tI3TPlsLFTa3WjSK7fjvPpOWRRTkjWM",
    authDomain: "studion-b9c48.firebaseapp.com",
    projectId: "studion-b9c48",
    storageBucket: "studion-b9c48.appspot.com",
    messagingSenderId: "637751883980",
    appId: "1:637751883980:web:7eee84ee74b39720902a69"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();