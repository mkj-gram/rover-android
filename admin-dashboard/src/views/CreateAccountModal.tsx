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
    Modal,
    Input
} from 'semantic-ui-react'
import { State } from '../../typings'
import { createAccount, viewSwitch } from '../actions'
import { getActiveView } from '../reducers'

interface CreateAccoutModalStateProps {
    activeView: string
}
interface DispatchProps {
    createAccount: (name: string, accountname: string) => void
    viewSwitch: (view: string) => void
}
interface CreateAccoutModalConstructorProps {
    trigger: JSX.Element
}

type CreateAccoutModalProps = CreateAccoutModalConstructorProps &
    CreateAccoutModalStateProps &
    DispatchProps

interface CreateAccoutModalState {
    name: string
    accountname: string
}

class CreateAccoutModal extends React.PureComponent<
    CreateAccoutModalProps,
    CreateAccoutModalState
> {
    constructor(props: CreateAccoutModalProps) {
        super(props)
        this.createAccount = this.createAccount.bind(this)
        this.closeCreateAccoutModal = this.closeCreateAccoutModal.bind(this)
        this.state = {
            name: '',
            accountname: ''
        }
    }

    closeCreateAccoutModal() {
        this.setState({
            name: '',
            accountname: ''
        })
        this.props.viewSwitch('accounts')
    }

    handleFormChange = (
        e: React.FormEvent<HTMLInputElement>,
        { field, value }: FormInputProps
    ) => {
        this.setState({ [field]: value } as CreateAccoutModalState)
    }

    createAccount() {
        const { name, accountname } = this.state
        if (name === '' || accountname === '') {
            return
        }
        this.props.createAccount(name, accountname)
        this.setState({
            name: '',
            accountname: ''
        })
    }

    render() {
        const { trigger, activeView } = this.props
        const { name, accountname } = this.state
        const disableSubmit = name === '' || accountname === ''
        return (
            <Modal
                size="small"
                trigger={trigger}
                open={activeView === 'create account'}
                onClose={this.closeCreateAccoutModal}
            >
                <Header icon="chess king" content="Create Account" />
                <Modal.Content>
                    <Form onSubmit={this.createAccount}>
                        <Form.Input
                            autoFocus={true}
                            label="Name"
                            field="name"
                            placeholder="Display name for the account"
                            onChange={this.handleFormChange}
                        />
                        <Form.Input
                            label="Account Name"
                            field="accountname"
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
                        color="teal"
                        onClick={this.createAccount}
                    >
                        <Icon name="checkmark" /> Create
                    </Button>
                    <Button
                        basic={true}
                        color="orange"
                        onClick={this.closeCreateAccoutModal}
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
    viewSwitch: (view: string) => dispatch(viewSwitch(view)),

    createAccount: (name: string, accountname: string) =>
        dispatch(createAccount(name, accountname))
})

const mapStateToProps = (state: State): CreateAccoutModalStateProps => ({
    activeView: getActiveView(state)
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAccoutModal)
