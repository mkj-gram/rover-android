// https://github.com/firebase/firebaseui-web/issues/114
declare module 'firebaseui' {
    import firebase from 'firebase'

    interface IConfig {
        callbacks?: ICallbacks
        credentialHelper?: auth.CredentialHelper
        queryParameterForSignInSuccessUrl?: string
        queryParameterForWidgetMode?: string
        signInFlow?: 'redirect' | 'popup'
        signInOptions: Array<ISignInOption | string>
        signInSuccessUrl?: string
        tosUrl?: string
    }
    interface ICallbacks {
        signInSuccess?: (
            currentUser: firebase.User,
            credential?: firebase.auth.AuthCredential,
            redirectUrl?: string
        ) => boolean
        signInSuccessWithAuthResult?: (
            authResult: firebase.auth.UserCredential,
            redirectUrl?: string
        ) => boolean
        uiShown?: () => void
    }
    interface ISignInOption {
        provider: string
        authMethod: string
        clientId: string
        scopes?: Array<string>
    }

    namespace auth {
        enum CredentialHelper {
            ACCOUNT_CHOOSER_COM,
            NONE
        }
        class AuthUI {
            constructor(auth: firebase.auth.Auth)
            start: (containerCSSselector: string, config: IConfig) => void
            reset: () => void
        }
    }
}
