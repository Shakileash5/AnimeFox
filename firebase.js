import firebase from "firebase/app";
import firestore from 'firebase/firestore';

const settings = {timestampsInSnapshots: true};

const config = {
  apiKey: "AIzaSyBfLAh1wRW6iLPL27m6q1eDwLf2yf9nL7Q",
  authDomain: "animefox-d98e3.firebaseio.com/",
  databaseURL: "https://animefox-d98e3-default-rtdb.firebaseio.com/",
  projectId: "animefox-d98e3",
  storageBucket: "https://animefox-d98e3.com/",
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;