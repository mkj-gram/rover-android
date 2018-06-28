import { User } from '@firebase/auth-types'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { Menu, MenuItemProps, Segment } from 'semantic-ui-react'
import { State } from '../../typings'
import { tabSwitch, fetchAccounts } from '../actions'
import { getActiveTab, getIsAuthenticated, getUser } from '../reducers'

interface DashboardStateProps {
    isAuthenticated: boolean
    user: User
    activeTab: string
}
interface DispatchProps {
    tabSwitch: (tab: string) => void
    fetchAccounts: () => void
}

type DashboardPageProps = DashboardStateProps & DispatchProps

class Dashboard extends React.PureComponent<DashboardPageProps, {}> {
    constructor(props: DashboardPageProps) {
        super(props)
    }

    handleItemClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        { name }: MenuItemProps
    ) => this.props.tabSwitch(name)

    logout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => window.location.replace('/login'))
    }

    render() {
        const { isAuthenticated, user, activeTab } = this.props

        return isAuthenticated && user ? (
            <div>
                <Menu pointing={true} secondary={true} color={'teal'}>
                    <Menu.Item header={true}>Rover Admin</Menu.Item>
                    <Menu.Item
                        name="dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name="create account"
                        active={activeTab === 'create account'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Menu position="right">
                        <Menu.Item
                            style={{
                                paddingBottom: '2%',
                                paddingTop: '2%'
                            }}
                        >
                            <img
                                style={{
                                    height: '30px',
                                    marginRight: '2%',
                                    width: '30px'
                                }}
                                src={user.photoURL}
                                alt={user.displayName}
                            />
                            <div>{user.displayName}</div>
                        </Menu.Item>
                        <Menu.Item name="logout" onClick={this.logout} />
                    </Menu.Menu>
                </Menu>

                <Segment>Accounts List Here</Segment>
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
    tabSwitch: (tab: string) => dispatch(tabSwitch(tab)),
    fetchAccounts: () => dispatch(fetchAccounts())
})

const mapStateToProps = (state: State): DashboardStateProps => ({
    isAuthenticated: getIsAuthenticated(state),
    user: getUser(state),
    activeTab: getActiveTab(state)
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
    // tslint:disable-next-line:no-any
)(Dashboard) as any)
