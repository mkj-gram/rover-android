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
    Modal
} from 'semantic-ui-react'
import { State } from '../../typings'
import { createUser } from '../actions'

interface DispatchProps {
    createUser: (
        accountId: number,
        name: string,
        email: string,
        password: string
    ) => void
}
interface CreateUserModalConstructorProps {
    accountId: number
}

type CreateUserModalProps = CreateUserModalConstructorProps & DispatchProps

interface CreateUserModalState {
    open: boolean
    name: string
    email: string
    password: string
}

class CreateUserModal extends React.PureComponent<
    CreateUserModalProps,
    CreateUserModalState
> {
    constructor(props: CreateUserModalProps) {
        super(props)
        this.createUser = this.createUser.bind(this)
        this.openCreateUserModal = this.openCreateUserModal.bind(this)
        this.closeCreateUserModal = this.closeCreateUserModal.bind(this)
        this.state = {
            open: false,
            name: '',
            email: '',
            password: ''
        }
    }

    openCreateUserModal() {
        this.setState({
            open: true
        })
    }

    closeCreateUserModal() {
        this.setState({
            open: false,
            name: '',
            email: '',
            password: ''
        })
    }

    handleFormChange = (
        e: React.FormEvent<HTMLInputElement>,
        { field, value }: FormInputProps
    ) => {
        this.setState({ [field]: value } as CreateUserModalState)
    }

    createUser() {
        const { accountId } = this.props
        const { name, email, password } = this.state
        if (name === '' || email === '' || password === '') {
            return
        }
        this.props.createUser(accountId, name, email, password)
        this.setState({
            open: false,
            name: '',
            email: '',
            password: ''
        })
    }

    render() {
        const { open, name, email, password } = this.state
        const disableSubmit = name === '' || email === '' || password === ''

        return (
            <Modal
                size="small"
                trigger={
                    <Button
                        icon={true}
                        color="teal"
                        size="mini"
                        onClick={this.openCreateUserModal}
                    >
                        <Icon name="user" /> Create User
                    </Button>
                }
                open={open}
                onClose={this.closeCreateUserModal}
            >
                <Header icon="user" content="Create User" />
                <Modal.Content>
                    <Form onSubmit={this.createUser}>
                        <Form.Input
                            autoFocus={true}
                            label="Name"
                            field="name"
                            autoComplete="off"
                            placeholder="Display name for the user"
                            onChange={this.handleFormChange}
                        />
                        <Form.Input
                            label="Email"
                            field="email"
                            type="email"
                            autoComplete="off"
                            placeholder="Unique email associated with this user"
                            onChange={this.handleFormChange}
                        />
                        <Form.Input
                            label="Password"
                            field="password"
                            type="password"
                            autoComplete="off"
                            placeholder="Must contain 6 characters"
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
                        color="teal"
                        onClick={this.createUser}
                    >
                        <Icon name="checkmark" /> Create
                    </Button>
                    <Button
                        basic={true}
                        color="orange"
                        onClick={this.closeCreateUserModal}
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
    createUser: (
        accountId: number,
        name: string,
        email: string,
        password: string
    ) => dispatch(createUser(accountId, name, email, password))
})

export default connect(
    null,
    mapDispatchToProps
)(CreateUserModal)
