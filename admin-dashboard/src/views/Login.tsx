import { User } from '@firebase/auth-types'
import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { State } from '../../typings'
import { authenticate, resetLogin } from '../actions'
import firebase, { ui } from '../Firebase'
import { getIsUnauthorized, getUser } from '../reducers'
import FirebaseAuth from './FirebaseAuth'

const oauthClientID = process.env.AUTH_CLIENT_ID

interface LoginStateProps {
    unauthorizedLogin: boolean
    user: User
}
interface DispatchProps {
    authenticate: (user: User) => void
    resetLogin: () => void
}

type LoginPageProps = LoginStateProps & DispatchProps

class Login extends React.PureComponent<LoginPageProps, {}> {
    constructor(props: LoginPageProps) {
        super(props)
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.props.authenticate(user)
        })
    }

    resetLogin = () => {
        this.props.resetLogin()
    }

    logout = () => {
        firebase.auth().signOut()
    }

    render() {
        const { unauthorizedLogin, user } = this.props
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
                {user && !unauthorizedLogin ? (
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
                            <button onClick={this.logout}>Sign Out</button>
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

// tslint:disable-next-line:no-any
const mapDispatchToProps = (
    dispatch: ThunkDispatch<State, void, AnyAction>
): DispatchProps => ({
    authenticate: (user: User) => {
        dispatch(authenticate(user))
    },
    resetLogin: () => dispatch(resetLogin())
})

const mapStateToProps = (state: State): LoginStateProps => ({
    unauthorizedLogin: getIsUnauthorized(state),
    user: getUser(state)
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
    // tslint:disable-next-line:no-any
)(Login) as any)
