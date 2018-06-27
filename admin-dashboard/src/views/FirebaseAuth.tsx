import { UserCredential } from '@firebase/auth-types'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import * as React from 'react'

const CONTAINER_ID = 'firebaseui_container'

interface FirebaseAuthProps {
    ui: firebaseui.auth.AuthUI
}

class FirebaseAuth extends React.Component<FirebaseAuthProps, {}> {
    ui: firebaseui.auth.AuthUI
    uiConfig: firebaseui.IConfig

    constructor(props: FirebaseAuthProps) {
        super(props)
        this.ui = this.props.ui
        this.uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: (
                    authResult: UserCredential,
                    redirectUrl?: string
                ) => {
                    // Don't want redirect
                    return false
                }
            },
            signInOptions: [
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    // Required to enable this provider in One-Tap Sign-up.
                    authMethod: 'https://accounts.google.com',
                }
            ]
        }
    }

    componentDidMount() {
        this.ui.start('#' + CONTAINER_ID, this.uiConfig)
    }

    componentWillUnmount() {
        this.ui.reset()
    }

    render() {
        return <div id={CONTAINER_ID} />
    }
}

export default FirebaseAuth
