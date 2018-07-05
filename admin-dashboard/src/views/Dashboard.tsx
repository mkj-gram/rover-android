import { User } from '@firebase/auth-types'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as moment from 'moment-timezone'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import {
    Button,
    Dropdown,
    Grid,
    Image,
    Menu,
    MenuItemProps,
    Message,
    Table
} from 'semantic-ui-react'
import { Account, State, StringMap } from '../../typings'
import { fetchAccounts, viewSwitch } from '../actions'
import {
    getActiveView,
    getIsAuthenticated,
    getIsAuthLoading,
    getUser
} from '../reducers'
import CreateAccountModal from './CreateAccountModal'

interface DashboardStateProps {
    isAuthLoading: boolean
    isAuthenticated: boolean
    user: User
    accounts: StringMap<Account>
    activeView: string
    isError: StringMap<boolean | string>
}
interface DispatchProps {
    viewSwitch: (view: string) => void
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
    ) => this.props.viewSwitch(name)

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
            activeView,
            isError
        } = this.props

        return isAuthenticated && user && !isAuthLoading ? (
            <div>
                <Menu
                    pointing={true}
                    secondary={true}
                    color={'teal'}
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
                    color={'teal'}
                    style={{
                        margin: '0'
                    }}
                    size="mini"
                >
                    <Menu.Item
                        header={true}
                        name="accounts"
                        active={activeView === 'accounts'}
                        onClick={this.handleItemClick}
                    />
                    <CreateAccountModal
                        trigger={
                            <Menu.Item
                                position="right"
                                name="create account"
                                onClick={this.handleItemClick}
                            >
                                <Button name="create account" color="teal">
                                    Create Account
                                </Button>
                            </Menu.Item>
                        }
                    />
                </Menu>
                <Grid>
                    <Grid.Column stretched={true}>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Account Name
                                    </Table.HeaderCell>
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
                                                {
                                                    accounts[accountId]
                                                        .accountname
                                                }
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
                {isError.error &&
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
                                header="Error"
                                content={isError.message}
                                color="orange"
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
    accounts: state.accounts,
    activeView: getActiveView(state),
    isError: state.isError
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
    // tslint:disable-next-line:no-any
)(Dashboard) as any)
