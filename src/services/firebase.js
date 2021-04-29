import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEv8GsS1M3fNXN7hKeF-6fUHLNHJoFN4k",
  authDomain: "spbox-2019.firebaseapp.com",
  databaseURL: "https://spbox-2019.firebaseio.com",
  projectId: "spbox-2019",
  storageBucket: "spbox-2019.appspot.com",
  messagingSenderId: "219116735470",
  appId: "1:219116735470:web:b1a3b19990234b3614dcff",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default {
  firebase,
  db,
};
