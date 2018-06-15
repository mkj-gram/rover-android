import * as React from 'react'
import firebase from 'firebase'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

const CONTAINER_ID = 'firebaseui_container'

interface FirebaseAuthProps {
    ui: firebaseui.auth.AuthUI
    oauthClientID: string
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
                    authResult: firebase.auth.UserCredential,
                    redirectUrl?: string
                ) => {
                    // Dont redirect
                    return false
                }
            },
            signInOptions: [
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    // Required to enable this provider in One-Tap Sign-up.
                    authMethod: 'https://accounts.google.com',
                    clientId: this.props.oauthClientID
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
