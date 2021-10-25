import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAqtDlm0HJKfVLMoRwqn1xIhwTDAk1yvIc",
    authDomain: "sistema-chamados-d7565.firebaseapp.com",
    projectId: "sistema-chamados-d7565",
    storageBucket: "sistema-chamados-d7565.appspot.com",
    messagingSenderId: "640621475103",
    appId: "1:640621475103:web:e01daa79a997b8ed196c2a",
    measurementId: "G-7L6Y4GVJL7"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;