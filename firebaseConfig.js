// firebaseConfig.js
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5_cZ_2lfLRARcf7OivFk5OAR51X85kyw",
  authDomain: "greencommute-277a0.firebaseapp.com",
  projectId: "greencommute-277a0",
  storageBucket: "greencommute-277a0.appspot.com",
  messagingSenderId: "998535691827",
  appId: "1:998535691827:web:31bf8dcc019ce0e526ed46",
  measurementId: "G-Q8R1W7JKCN",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
