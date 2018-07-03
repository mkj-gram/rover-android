/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Button, white } from '@rover/ts-bootstrap/dist/src'

import WizardModal from '../wizards/WizardModal'

import {
    getIsWizardModalClosing,
    getShouldShowSaveAndClose
} from '../../reducers'
import {
    createEditableCampaign,
    closeWizardModal,
    closeSettingsPagePhonePreview
} from '../../actions'

export interface ScheduledSettingsFormStateProps {
    isWizardModalClosing: boolean
    showSaveAndClose: boolean
}

export interface ScheduledSettingsFormProps {
    device: Media
    campaignId: string
    saveAndClose: () => void
    children: JSX.Element
}

export interface ScheduledSettingsFormDispatchProps {
    closeWizardModal: () => void
    createEditableCampaign: (campaignId: string) => void
    closeSettingsPagePhonePreview: () => void
}

const ScheduledDelivery: React.SFC<
    ScheduledSettingsFormStateProps &
        ScheduledSettingsFormProps &
        ScheduledSettingsFormDispatchProps
> = ({
    campaignId,
    device,
    saveAndClose,
    children,

    closeWizardModal,
    createEditableCampaign,
    closeSettingsPagePhonePreview,

    isWizardModalClosing,
    showSaveAndClose
}) => {
    const animation = isWizardModalClosing ? 'close' : 'open'

    const getSaveAndCloseButton = () => {
        if (!showSaveAndClose) {
            return <div />
        }
        return (
            <Button
                onClick={() => {
                    saveAndClose()
                    closeWizardModal()
                    closePhonePreview()
                }}
                size="large"
                text="Save & Close"
                type="regular"
            />
        )
    }

    const closePhonePreview = () => {
        const wizardSection =
            children.props.wizardSection ||
            children.props.children[0].props.wizardSection
        switch (wizardSection) {
            case 'tapBehavior':
                closeSettingsPagePhonePreview()
                break
            default:
                break
        }
    }

    const getCancelButton = () => {
        return (
            <Button
                onClick={() => {
                    closeWizardModal()
                    createEditableCampaign(campaignId)
                    closePhonePreview()
                }}
                size="large"
                text="Cancel"
                type="regular"
            />
        )
    }

    const wizardProps = {
        device,
        rightHeaderElement: getSaveAndCloseButton(),
        leftHeaderElement: getCancelButton()
    }
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                background: white,
                animation: `${animation} 500ms ease`
            }}
            id="scheduledSettingsForm"
        >
            <WizardModal {...wizardProps}>
                <div
                    style={{
                        zIndex: 5,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        backgroundColor: white,
                        overflowY: 'scroll'
                    }}
                >
                    {children}
                </div>
            </WizardModal>
        </div>
    )
}

const mapStateToProps = (state: State): ScheduledSettingsFormStateProps => ({
    isWizardModalClosing: getIsWizardModalClosing(state),
    showSaveAndClose: getShouldShowSaveAndClose(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): ScheduledSettingsFormDispatchProps => {
    return {
        createEditableCampaign: (campaignId: string) =>
            dispatch(createEditableCampaign(campaignId)),
        closeWizardModal: () => dispatch(closeWizardModal()),
        closeSettingsPagePhonePreview: () => {
            dispatch(closeSettingsPagePhonePreview())
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScheduledDelivery)
