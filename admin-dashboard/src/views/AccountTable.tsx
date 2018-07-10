import * as moment from 'moment-timezone'
import * as React from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import { Account, State, StringMap } from '../../typings'
import CreateUserModal from './CreateUserModal'

interface AccountTableStateProps {
    accounts: StringMap<Account>
}

interface DispatchProps {}

type AccountTableProps = AccountTableStateProps & DispatchProps

class AccountTable extends React.PureComponent<AccountTableProps, {}> {
    render() {
        const { accounts } = this.props
        return (
            <Table color="blue">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Account Name</Table.HeaderCell>
                        <Table.HeaderCell>Updated At</Table.HeaderCell>
                        <Table.HeaderCell>Created At</Table.HeaderCell>
                        <Table.HeaderCell>No. Users</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
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
                                    {accounts[accountId].accountname}
                                </Table.Cell>
                                <Table.Cell>
                                    {moment(accounts[accountId].updatedAt)
                                        .tz(moment.tz.guess())
                                        .format('YYYY-MM-DD HH:mm z')}
                                </Table.Cell>
                                <Table.Cell>
                                    {moment(accounts[accountId].createdAt)
                                        .tz(moment.tz.guess())
                                        .format('YYYY-MM-DD HH:mm z')}
                                </Table.Cell>
                                <Table.Cell>1337</Table.Cell>
                                <Table.Cell>
                                    <CreateUserModal
                                        accountId={accounts[accountId].id}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table>
        )
    }
}

const mapStateToProps = (state: State) => ({
    accounts: state.accounts
})

export default connect(mapStateToProps)(AccountTable)
