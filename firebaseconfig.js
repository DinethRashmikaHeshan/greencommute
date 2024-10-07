// firebaseConfig.js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD4r2R6g0qyK39acFjzI5ZN83cUgTCVfuA",
  authDomain: "greencommute-435210.firebaseapp.com",
  projectId: "greencommute-435210",
  storageBucket: "greencommute-435210.appspot.com",
  messagingSenderId: "572644576603",
  appId: "1:572644576603:android:667e08fc5cfa116dc55e7e"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };