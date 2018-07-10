import * as React from 'react'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import {
    Button,
    Form,
    FormInputProps,
    Header,
    Icon,
    Menu,
    Modal
} from 'semantic-ui-react'
import { State } from '../../typings'
import { createAccount } from '../actions'

interface DispatchProps {
    createAccount: (name: string, accountname: string) => void
}

interface CreateAccountModalState {
    open: boolean
    name: string
    accountname: string
}

class CreateAccountModal extends React.PureComponent<
    DispatchProps,
    CreateAccountModalState
> {
    constructor(props: DispatchProps) {
        super(props)
        this.createAccount = this.createAccount.bind(this)
        this.openCreateAccountModal = this.openCreateAccountModal.bind(this)
        this.closeCreateAccountModal = this.closeCreateAccountModal.bind(this)
        this.state = {
            open: false,
            name: '',
            accountname: ''
        }
    }

    openCreateAccountModal() {
        this.setState({
            open: true
        })
    }

    closeCreateAccountModal() {
        this.setState({
            open: false,
            name: '',
            accountname: ''
        })
    }

    handleFormChange = (
        e: React.FormEvent<HTMLInputElement>,
        { field, value }: FormInputProps
    ) => {
        this.setState({ [field]: value } as CreateAccountModalState)
    }

    createAccount() {
        const { name, accountname } = this.state
        if (name === '' || accountname === '') {
            return
        }
        this.props.createAccount(name, accountname)
        this.setState({
            open: false,
            name: '',
            accountname: ''
        })
    }

    render() {
        const { open, name, accountname } = this.state
        const disableSubmit = name === '' || accountname === ''
        return (
            <Modal
                size="small"
                trigger={
                    <Menu.Item position="right" name="create account">
                        <Button
                            icon={true}
                            name="create account"
                            color="blue"
                            onClick={this.openCreateAccountModal}
                        >
                            <Icon name="user circle" />
                            Create Account
                        </Button>
                    </Menu.Item>
                }
                open={open}
                onClose={this.closeCreateAccountModal}
            >
                <Header icon="user circle" content="Create Account" />
                <Modal.Content>
                    <Form onSubmit={this.createAccount}>
                        <Form.Input
                            autoFocus={true}
                            label="Name"
                            field="name"
                            autoComplete="off"
                            placeholder="Display name for the account"
                            onChange={this.handleFormChange}
                        />
                        <Form.Input
                            label="Account Name"
                            field="accountname"
                            autoComplete="off"
                            placeholder="Unique account name"
                            onChange={this.handleFormChange}
                        />
                        <button
                            style={{
                                display: 'none'
                            }}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        disabled={disableSubmit}
                        color="blue"
                        onClick={this.createAccount}
                    >
                        <Icon name="checkmark" /> Create
                    </Button>
                    <Button
                        basic={true}
                        color="orange"
                        onClick={this.closeCreateAccountModal}
                    >
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

// tslint:disable-next-line:no-any
const mapDispatchToProps = (
    dispatch: ThunkDispatch<State, void, AnyAction>
): DispatchProps => ({
    createAccount: (name: string, accountname: string) =>
        dispatch(createAccount(name, accountname))
})

export default connect(
    null,
    mapDispatchToProps
)(CreateAccountModal)
