// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvrUlKcxiXqOfwVK5LmMSi5sQaOj5GoCo",
  authDomain: "react-c4daa.firebaseapp.com",
  projectId: "react-c4daa",
  storageBucket: "react-c4daa.appspot.com",
  messagingSenderId: "609582495846",
  appId: "1:609582495846:web:7fe9fb70c63073f5af55a7",
  measurementId: "G-2B9D1PS8NL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

//connect to db firebase
export  { db, storage };

