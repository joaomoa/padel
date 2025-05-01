import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCUnzHX_8NgKjeiIxJzIRGX16ZI-8JrnMI",
    authDomain: "padel-723fa.firebaseapp.com",
    projectId: "padel-723fa",
    storageBucket: "padel-723fa.firebasestorage.app",
    messagingSenderId: "378292715014",
    appId: "1:378292715014:web:9dfa47c2d8499063d54d87",
    measurementId: "G-7S25JLKYK7"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);