import { User } from '@firebase/auth-types'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { Grid, Menu, MenuItemProps, Table } from 'semantic-ui-react'
import { State, StringMap, Account } from '../../typings'
import { tabSwitch, fetchAccounts } from '../actions'
import {
    getActiveTab,
    getIsAuthenticated,
    getIsAuthLoading,
    getUser
} from '../reducers'
import * as moment from 'moment-timezone'

interface DashboardStateProps {
    accounts: StringMap<Account>
    isAuthLoading: boolean
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

    componentDidUpdate(prevProps: DashboardStateProps & DispatchProps) {
        const { isAuthLoading, fetchAccounts } = this.props
        const prevIsAuthLoading = prevProps.isAuthLoading

        if (prevIsAuthLoading && !isAuthLoading) {
            fetchAccounts()
        }
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
        const {
            accounts,
            isAuthLoading,
            isAuthenticated,
            user,
            activeTab,
            fetchAccounts
        } = this.props

        return isAuthenticated && user && !isAuthLoading ? (
            <div>
                <Menu pointing={true} secondary={true} color={'teal'}>
                    <Menu.Item header={true}>Rover Admin</Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item
                            name="create account"
                            active={activeTab === 'create account'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            style={{
                                paddingTop: '5px',
                                paddingBottom: '5px'
                            }}
                        >
                            <img
                                style={{
                                    height: '30',
                                    marginRight: '2%',
                                    width: '30'
                                }}
                                src={user.photoURL}
                                alt={user.displayName}
                            />
                            <div>{user.displayName}</div>
                        </Menu.Item>
                        <Menu.Item name="logout" onClick={this.logout} />
                    </Menu.Menu>
                </Menu>

                <Grid>
                    <Grid.Column stretched={true} width={4}>
                        <Menu
                            vertical={true}
                            pointing={true}
                            secondary={true}
                            color={'teal'}
                        >
                            {/* <Menu.Item header={true}>Rover Admin</Menu.Item> */}
                            <Menu.Item
                                name="dashboard"
                                active={activeTab === 'dashboard'}
                                onClick={this.handleItemClick}
                            />
                        </Menu>
                    </Grid.Column>

                    <Grid.Column stretched={true} width={12}>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Updated At
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Created At
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {Object.keys(accounts).map(accountId => {
                                    return (
                                        <Table.Row key={accountId}>
                                            <Table.Cell>
                                                {accounts[accountId].id}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {accounts[accountId].name}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {moment(
                                                    accounts[accountId]
                                                        .updatedAt
                                                )
                                                    .tz(moment.tz.guess())
                                                    .format(
                                                        'YYYY-MM-DD HH:mm z'
                                                    )}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {moment(
                                                    accounts[accountId]
                                                        .createdAt
                                                )
                                                    .tz(moment.tz.guess())
                                                    .format(
                                                        'YYYY-MM-DD HH:mm z'
                                                    )}
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid>
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
    accounts: state.accounts,
    isAuthLoading: getIsAuthLoading(state),
    isAuthenticated: getIsAuthenticated(state),
    user: getUser(state),
    activeTab: getActiveTab(state)
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
    // tslint:disable-next-line:no-any
)(Dashboard) as any)
