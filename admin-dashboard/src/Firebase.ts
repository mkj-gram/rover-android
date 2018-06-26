import { FirebaseOptions } from '@firebase/app-types'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.FIREBASE_CONFIG_APIKEY,
    authDomain: process.env.FIREBASE_CONFIG_AUTHDOMAIN,
    databaseURL: process.env.FIREBASE_CONFIG_DATABASEURL,
    projectId: process.env.FIREBASE_CONFIG_PROJECTID,
    storageBucket: process.env.FIREBASE_CONFIG_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_CONFIG_MESSAGINGSENDERID
}

firebase.initializeApp(firebaseConfig)
export const ui = new firebaseui.auth.AuthUI(firebase.auth())
export default firebase
