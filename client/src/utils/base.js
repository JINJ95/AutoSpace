import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/firestore'

export const app = firebase.initializeApp({
    apiKey: " ",
    authDomain: "autospace-1234b.firebaseapp.com",
    databaseURL: "https://autospace-1234b.firebaseio.com",
    projectId: "autospace-1234b",
    storageBucket: "autospace-1234b.appspot.com",
    messagingSenderId: "244631909389",
    appId: "1:244631909389:web:fd3ea4f031b11df61cd144",
    measurementId: "G-B0L82YYQEG"
});
