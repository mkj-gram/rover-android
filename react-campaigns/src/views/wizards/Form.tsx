/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { parse } from 'qs'
import { connect, Dispatch } from 'react-redux'
import {
    white,
    Button,
    AlertOptionsPushNotification
} from '@rover/ts-bootstrap/dist/src'

import {
    getCampaign,
    getEditableCampaign,
    getEditableUIState,
    getIsStageValid,
    getLastViewPage,
    getShouldShowSaveAndClose,
    getTypeProgress
} from '../../reducers/'

import PhonePreview from './PhonePreview'
import WizardModal from './WizardModal'

import {
    closeWizardModal,
    createEditableCampaign,
    setCurrentFormPage,
    updateEditableUIState
} from '../../actions'

export interface FormProps extends ResponsiveContainerProps {
    campaignId: string
    children: JSX.Element[]
    device?: Media
    saveAndClose: () => void
    type: UIStateType
}

export interface FormDispatchProps {
    createEditableCampaign: () => void
    setCurrentFormPage: (formPage: formPage) => void
    closeWizardModal: () => void
    updateEditableUIState: (
        newUIStateGroup: keyof editableUIState,
        newUIStateValue: UIStateField | boolean
    ) => void
}

export interface FormStateProps {
    editableCampaign: Campaign
    editableUIState: editableUIState
    getIsStageValid: (stage: keyof editableUIState) => boolean
    getTypeProgress: (type: UIStateType) => number
    showSaveAndClose: boolean
}

export interface FormState {
    formAnimation: 'ltr' | 'rtl' | ''
    formStack: (keyof editableUIState)[]
}

class Form extends React.Component<
    FormProps & FormDispatchProps & FormStateProps,
    FormState
> {
    constructor(props: FormProps & FormDispatchProps & FormStateProps) {
        super(props)
        const {
            children,
            editableUIState,
            getIsStageValid,
            getTypeProgress
        } = this.props
        const initialFormStack = children.reduce(
            (prev: string[], next: JSX.Element, index: number) => {
                const stage: keyof editableUIState = next.props.wizardSection
                const UIState: UIStateField = editableUIState[stage]
                const { seen, type } = UIState

                const isPrevValid = getIsStageValid(prev.slice(
                    -1
                )[0] as keyof editableUIState)

                const typeProgress = getTypeProgress(type)
                const prevUIState: UIStateField =
                    editableUIState[
                        prev[prev.length - 1] as keyof editableUIState
                    ]
                const prevSeen = prevUIState.seen

                if (index === 0) {
                    return prev
                }

                if (typeProgress === 100) {
                    return prev
                }

                if (isPrevValid && prevSeen) {
                    return [...prev, stage]
                }

                return prev
            },
            [children[0].props.wizardSection]
        )

        this.state = {
            formStack: initialFormStack,
            formAnimation: ''
        }
        this.setState = this.setState.bind(this)
    }

    componentWillMount() {
        const { createEditableCampaign, editableCampaign } = this.props
        if (!editableCampaign) {
            createEditableCampaign()
        }
    }

    componentDidMount() {
        const { setCurrentFormPage } = this.props
        const { formStack } = this.state
        setCurrentFormPage(formStack[formStack.length - 1])
    }

    getBackButton() {
        const { setCurrentFormPage } = this.props
        const { formStack } = this.state

        if (formStack.length <= 1) {
            return null
        }

        return (
            <Button
                text="Back"
                size="large"
                type="secondary"
                overrideWidth={96}
                onClick={() => {
                    setCurrentFormPage(formStack[formStack.length - 2])
                    this.setState(
                        {
                            formAnimation: 'rtl'
                        },
                        () =>
                            setTimeout(
                                () =>
                                    this.setState({
                                        formStack: formStack.slice(0, -1),
                                        formAnimation: ''
                                    }),
                                300
                            )
                    )
                }}
            />
        )
    }

    getCancelButton() {
        const {
            closeWizardModal,
            createEditableCampaign,
            setCurrentFormPage
        } = this.props
        return (
            <Button
                onClick={() => {
                    closeWizardModal()
                    setCurrentFormPage('')
                    createEditableCampaign()
                }}
                size="large"
                text="Cancel"
                type="regular"
            />
        )
    }

    getNextButton(nextForm: keyof editableUIState) {
        const {
            children,
            editableCampaign,
            editableUIState,
            getIsStageValid,
            setCurrentFormPage,
            closeWizardModal,
            updateEditableUIState
        } = this.props
        const { formStack } = this.state

        const lastForm: keyof editableUIState = formStack.slice(-1)[0]
        const UIState = editableUIState[lastForm] as UIStateField

        const isValid = getIsStageValid(lastForm)
        return (
            <Button
                text="Next"
                size="large"
                type={isValid ? 'primary' : 'disabled'}
                overrideWidth={96}
                onClick={() =>
                    this.setState(
                        {
                            formAnimation: 'ltr',
                            formStack: [...formStack, nextForm]
                        },
                        () => {
                            setCurrentFormPage(nextForm)
                            this.setFormAsSeen(lastForm)
                        }
                    )
                }
            />
        )
    }

    getFinishButton() {
        const {
            getIsStageValid,
            closeWizardModal,
            saveAndClose,
            setCurrentFormPage
        } = this.props
        const { formStack } = this.state
        const lastForm: keyof editableUIState = formStack.slice(-1)[0]

        const isValid = getIsStageValid(lastForm)

        return (
            <Button
                text="Finish"
                size="large"
                type={isValid ? 'primary' : 'disabled'}
                overrideWidth={96}
                onClick={() => {
                    setCurrentFormPage('')
                    closeWizardModal()
                    this.setFormAsSeen(lastForm)
                    saveAndClose()
                }}
            />
        )
    }

    getSaveAndCloseButton() {
        const {
            closeWizardModal,
            saveAndClose,
            setCurrentFormPage,
            showSaveAndClose
        } = this.props
        if (!showSaveAndClose) {
            return <div />
        }
        return (
            <Button
                onClick={() => {
                    saveAndClose()
                    setCurrentFormPage('')
                    closeWizardModal()
                }}
                size="large"
                text="Save & Close"
                type="regular"
            />
        )
    }

    setFormAsSeen(form: keyof editableUIState) {
        const { editableUIState, updateEditableUIState } = this.props
        updateEditableUIState(form, {
            ...(editableUIState[form] as UIStateField),
            seen: true
        })
    }

    render() {
        const Fragment = React.Fragment
        const { children, device, getTypeProgress, type } = this.props
        const { formAnimation, formStack } = this.state

        const formChildStyle: React.CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backgroundColor: white,
            overflowY: 'scroll'
        }
        const wizardProps = {
            device,
            progress: getTypeProgress(type),
            rightToolbarElement:
                children.length === formStack.length
                    ? this.getFinishButton()
                    : this.getNextButton(
                          children[formStack.length].props.wizardSection
                      ),
            leftToolbarElement: this.getBackButton(),
            rightHeaderElement: this.getSaveAndCloseButton(),
            leftHeaderElement: this.getCancelButton()
        }

        return (
            <Fragment>
                <WizardModal {...wizardProps}>
                    {children.map((child, index) => {
                        return (
                            formStack.includes(child.props.wizardSection) && (
                                <div
                                    key={index}
                                    style={{
                                        zIndex: index,
                                        ...formChildStyle,
                                        animation:
                                            index === formStack.length - 1 &&
                                            `${formAnimation} 300ms ease-in-out`
                                    }}
                                    id={`${
                                        child.props.wizardSection
                                    }_formStackBody`}
                                >
                                    {React.cloneElement(child, {
                                        isCurrentPage:
                                            index === formStack.length - 1
                                    })}
                                </div>
                            )
                        )
                    })}
                </WizardModal>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>,
    ownProps: FormProps
): FormDispatchProps => {
    const { campaignId } = ownProps
    return {
        createEditableCampaign: () =>
            dispatch(createEditableCampaign(campaignId)),
        setCurrentFormPage: (formPage: formPage) =>
            dispatch(setCurrentFormPage(formPage)),
        closeWizardModal: () => dispatch(closeWizardModal()),
        updateEditableUIState: (
            newUIStateGroup: keyof editableUIState,
            newUIStateValue: UIStateField | boolean
        ) => dispatch(updateEditableUIState(newUIStateGroup, newUIStateValue))
    }
}

const mapStateToProps = (
    state: State,
    ownProps: FormProps
): FormStateProps => ({
    editableCampaign: getEditableCampaign(state),
    editableUIState: getEditableUIState(state),
    getIsStageValid: stage => getIsStageValid(state, stage),
    getTypeProgress: type => getTypeProgress(state, type),
    showSaveAndClose: getShouldShowSaveAndClose(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Form)
