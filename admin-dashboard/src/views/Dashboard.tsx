import { User } from '@firebase/auth-types'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import {
    ButtonProps,
    Dropdown,
    Header,
    Image,
    Menu,
    Message
} from 'semantic-ui-react'
import { State, ToastState } from '../../typings'
import { fetchAccounts, viewSwitch } from '../actions'
import {
    getActiveView,
    getIsAuthenticated,
    getIsAuthLoading,
    getUser
} from '../reducers'
import AccountTable from './AccountTable'
import CreateAccountModal from './CreateAccountModal'

interface DashboardStateProps {
    isAuthLoading: boolean
    isAuthenticated: boolean
    user: User
    activeView: string
    isToast: ToastState
}
interface DispatchProps {
    viewSwitch: (view: string) => void
    fetchAccounts: () => void
}
type DashboardPageProps = DashboardStateProps & DispatchProps

class Dashboard extends React.PureComponent<DashboardPageProps, {}> {
    componentDidUpdate(prevProps: DashboardStateProps & DispatchProps) {
        const { isAuthLoading, fetchAccounts } = this.props
        const prevIsAuthLoading = prevProps.isAuthLoading

        if (prevIsAuthLoading && !isAuthLoading) {
            fetchAccounts()
        }
    }

    handleItemClick = (
        e: React.MouseEvent<HTMLButtonElement>,
        { name }: ButtonProps
    ) => this.props.viewSwitch(name)

    logout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => window.location.replace('/login'))
    }

    render() {
        const {
            isAuthLoading,
            isAuthenticated,
            user,
            activeView,
            isToast
        } = this.props

        return isAuthenticated && user && !isAuthLoading ? (
            <div>
                <Menu
                    pointing={true}
                    secondary={true}
                    style={{
                        margin: '0'
                    }}
                    size="small"
                >
                    <Menu.Item header={true}>Rover Admin</Menu.Item>
                    <Menu.Item
                        position="right"
                        style={{
                            paddingTop: '5px',
                            paddingBottom: '5px'
                        }}
                    >
                        <Dropdown
                            trigger={
                                <span>
                                    <Image
                                        avatar={true}
                                        src={user.photoURL}
                                        alt={user.displayName}
                                    />
                                    {user.displayName}
                                </span>
                            }
                            options={[
                                {
                                    key: 'sign-out',
                                    text: 'Sign Out',
                                    icon: 'sign out',
                                    onClick: this.logout
                                }
                            ]}
                            pointing="top left"
                            icon={null}
                        />
                    </Menu.Item>
                </Menu>
                <Menu
                    tabular={true}
                    color={'blue'}
                    style={{
                        margin: '0'
                    }}
                    size="mini"
                >
                    <Header
                        size="huge"
                        color="blue"
                        style={{
                            marginLeft: '1em',
                            marginBottom: '0',
                            marginTop: '5px'
                        }}
                    >
                        Accounts
                    </Header>
                    <CreateAccountModal />
                </Menu>
                <AccountTable />
                {isToast.display &&
                    ReactDOM.createPortal(
                        <div
                            style={{
                                zIndex: 20,
                                justifyContent: 'center',
                                position: 'absolute',
                                width: 300,
                                top: 5,
                                left: 'calc(50% - 150px)',
                                alignItems: 'center'
                            }}
                        >
                            <Message
                                content={isToast.message}
                                color={isToast.color}
                                floating={true}
                            />
                        </div>,
                        document.getElementById('root')
                    )}
            </div>
        ) : (
            <h1
                style={{
                    textAlign: 'center'
                }}
            >
                Loading...
            </h1>
        )
    }
}

// tslint:disable-next-line:no-any
const mapDispatchToProps = (
    dispatch: ThunkDispatch<State, void, AnyAction>
): DispatchProps => ({
    viewSwitch: (view: string) => dispatch(viewSwitch(view)),
    fetchAccounts: () => dispatch(fetchAccounts())
})

const mapStateToProps = (state: State): DashboardStateProps => ({
    isAuthLoading: getIsAuthLoading(state),
    isAuthenticated: getIsAuthenticated(state),
    user: getUser(state),
    activeView: getActiveView(state),
    isToast: state.isToast
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
    // tslint:disable-next-line:no-any
)(Dashboard) as any)
