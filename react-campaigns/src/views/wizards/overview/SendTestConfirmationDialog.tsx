/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { Dialog } from '@rover/ts-bootstrap/dist/src'

import { sendTest } from '../../../actions'
import { getSelectedTestDevices } from '../../../reducers'

export interface DialogModalProps extends InjectedProps {
    handleSendTestPrompt: () => void
    campaignId: number
}

export interface DispatchProps {
    sendTestNotification: (campaignId: number, deviceIds: string[]) => void
}

export interface TestDeviceStateProps {
    selectedTestDevices?: string[]
}

const DialogModal: React.SFC<
    DialogModalProps & DispatchProps & TestDeviceStateProps
> = ({
    handleSendTestPrompt,
    selectedTestDevices,
    sendTestNotification,
    campaignId,
    device
}) => {
    const promptStr = `You’re about to send a test version of this campaign to ${
        selectedTestDevices.length
    } ${selectedTestDevices.length > 1 ? 'devices' : 'device'}. Continue?`
    return (
        <Dialog
            buttonPrimaryText="Cancel"
            buttonSecondaryText="Send Test"
            primaryOnClick={handleSendTestPrompt}
            secondaryOnClick={() => {
                sendTestNotification(campaignId, selectedTestDevices)
                handleSendTestPrompt()
            }}
            isOpen={true}
            targetParent={
                device === 'Desktop' ? 'mainModalView' : 'mainModalLeft'
            }
            dialogText={promptStr}
            childStyle={{
                marginBottom: 32
            }}
        />
    )
}

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        sendTestNotification: (campaignId, deviceIds) => {
            dispatch(sendTest(campaignId, deviceIds))
        }
    }
}

const mapStatetoProps = (state: State): TestDeviceStateProps => ({
    selectedTestDevices: getSelectedTestDevices(state)
})

export default connect(mapStatetoProps, mapDispatchToProps)(DialogModal)
