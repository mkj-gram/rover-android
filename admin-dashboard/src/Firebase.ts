import firebase from 'firebase'
import * as firebaseui from 'firebaseui'

const firebaseConfig = process.env.FIREBASE_CONFIG

firebase.initializeApp(firebaseConfig)
export const ui = new firebaseui.auth.AuthUI(firebase.auth())
export default firebase
