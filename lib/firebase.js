// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6avTo2JmLA2xIOCiXyiaJFfWfRu6C0MQ",
  authDomain: "absensi-pns-mobile.firebaseapp.com",
  projectId: "absensi-pns-mobile",
  storageBucket: "absensi-pns-mobile.appspot.com",
  messagingSenderId: "451877912546",
  appId: "1:451877912546:web:091073a713e905fea303bb",
  measurementId: "G-QYG9F8HFJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }