import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { State } from '../../typings'
import { resetLogin } from '../actions'
import { ui } from '../Firebase'
import { getIsAuthenticated, getIsUnauthorized } from '../reducers'
import FirebaseAuth from './FirebaseAuth'

interface LoginStateProps {
    unauthorizedLogin: boolean
    isAuthenticated: boolean
}
interface DispatchProps {
    resetLogin: () => void
}

type LoginPageProps = LoginStateProps & DispatchProps

class Login extends React.PureComponent<LoginPageProps, {}> {
    constructor(props: LoginPageProps) {
        super(props)
    }

    resetLogin = () => {
        this.props.resetLogin()
    }

    render() {
        const { unauthorizedLogin, isAuthenticated } = this.props

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
                    <h2>Rover Admin</h2>
                </div>
                {isAuthenticated && !unauthorizedLogin ? (
                    <h1
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        Loading...
                    </h1>
                ) : unauthorizedLogin ? (
                    <div>
                        <h4>You must login using a valid rover.io email!</h4>
                        <button onClick={this.resetLogin}>Try Again</button>
                    </div>
                ) : (
                    <div>
                        <h4>Sign in below using your rover.io account</h4>
                        <FirebaseAuth ui={ui} />
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
    resetLogin: () => dispatch(resetLogin())
})

const mapStateToProps = (state: State): LoginStateProps => ({
    unauthorizedLogin: getIsUnauthorized(state),
    isAuthenticated: getIsAuthenticated(state)
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
    // tslint:disable-next-line:no-any
)(Login) as any)
