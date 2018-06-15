import * as React from 'react'
import firebase, { ui } from '../Firebase'
import FirebaseAuth from './FirebaseAuth'

const oauthClientID = process.env.AUTH_CLIENT_ID

interface LoginState {
    loading: boolean
    unauthorizedLogin: boolean
    user: firebase.User
}

class Login extends React.Component<{}, LoginState> {
    state: LoginState = {
        loading: true,
        unauthorizedLogin: false,
        user: null
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user && user.email.includes('@rover.io')) {
                return this.setState({ loading: false, user })
            }
            if (user && !user.email.includes('@rover.io')) {
                firebase.auth().currentUser.delete()
                return this.setState({
                    loading: false,
                    unauthorizedLogin: true,
                    user: null
                })
            }
            return this.setState({
                loading: false,
                user: null
            })
        })
    }

    // deleteAccount -- for testing/current purposes
    deleteAccount = () => {
        firebase
            .auth()
            .currentUser.delete()
            .catch(error => {
                if (error.code === 'auth/requires-recent-login') {
                    // User's credential is too old. Needs to sign in again.
                    firebase
                        .auth()
                        .signOut()
                        .then(() => {
                            // The timeout allows the message to be displayed after the UI has
                            // changed to the signed out state.
                            setTimeout(() => {
                                alert(
                                    'Please sign in again to delete your account.'
                                )
                            }, 1)
                        })
                }
            })
    }

    resetLogin = () => {
        this.setState({ loading: false, unauthorizedLogin: false, user: null })
    }

    render() {
        const { loading, unauthorizedLogin, user } = this.state

        return (
            <div
                style={{
                    fontFamily: 'Source Sans Pro, sans-serif',
                    textAlign: 'center'
                }}
            >
                <div
                    style={{
                        backgroundColor: '#2ac5d6',
                        padding: '20px',
                        color: 'white'
                    }}
                >
                    <h2>Admin Dashboard</h2>
                </div>
                {loading ? (
                    <div id="loading">Loading...</div>
                ) : user && !unauthorizedLogin ? (
                    <div>
                        <div
                            style={{
                                border: '1px solid #CCC',
                                clear: 'both',
                                margin: '0 auto 20px',
                                maxWidth: '400px',
                                padding: '10px',
                                textAlign: 'left',
                                display: 'table',
                                content: ''
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: '#EEE',
                                    border: '1px solid #CCC',
                                    float: 'left',
                                    height: '80px',
                                    marginRight: '10px',
                                    width: '80px'
                                }}
                            >
                                <img
                                    style={{
                                        height: '80px',
                                        margin: 0,
                                        width: '80px'
                                    }}
                                    src={user.photoURL}
                                    alt={user.displayName}
                                />
                            </div>
                            <div>{user.displayName}</div>
                            <div>{user.email}</div>
                        </div>
                        <p>
                            <button
                                onClick={() => {
                                    firebase.auth().signOut()
                                }}
                            >
                                Sign Out
                            </button>
                            <button onClick={this.deleteAccount}>
                                Delete account
                            </button>
                        </p>
                    </div>
                ) : unauthorizedLogin ? (
                    <div>
                        <h4>You must login using a valid rover.io email!</h4>
                        <button onClick={this.resetLogin}>Try Again</button>
                    </div>
                ) : (
                    <div>
                        <h4>Sign in below using your rover.io account</h4>
                        <FirebaseAuth ui={ui} oauthClientID={oauthClientID} />
                    </div>
                )}
            </div>
        )
    }
}

export default Login
