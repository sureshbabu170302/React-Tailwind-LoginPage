// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBfqXxfu4F-7y7aqKgrI9BhtwGZypQnDGw",
    authDomain: "react-project-322cd.firebaseapp.com",
    projectId: "react-project-322cd",
    storageBucket: "react-project-322cd.appspot.com",
    messagingSenderId: "947958820144",
    appId: "1:947958820144:web:7de467b78731e33994ecf5",
    measurementId: "G-EX8CG44Y59"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);