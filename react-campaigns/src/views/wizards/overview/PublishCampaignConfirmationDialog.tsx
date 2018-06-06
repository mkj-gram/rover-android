/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import {
    getEditableCampaign,
    getEditableCampaignDisplayTime,
    getEditableCampaignFormatDate
} from '../../../reducers'
import { publishCampaign } from '../../../actions'

import { Dialog } from '@rover/ts-bootstrap/dist/src'
import {
    isScheduledCampaign,
    isAutomatedNotificationCampaign
} from '../../utils/getCampaignType'

export interface PublishDialogProps extends InjectedProps {
    campaignId: number
    handlePublishCampaignPrompt: () => void
}

export interface PublishDialogStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    getDisplayTime: (timeField: string) => string
    getFormatDate: (dateField: string) => Date
}
export interface DispatchProps {
    publishCampaign: (campaignId: number) => void
}

const PublishCampaignConfirmationDialog: React.SFC<
    PublishDialogProps & PublishDialogStateProps & DispatchProps
> = ({
    campaignId,
    device,
    handlePublishCampaignPrompt,
    editableCampaign,
    publishCampaign,
    getFormatDate,
    getDisplayTime
}) => {
    const getDialogText = () => {
        let dialogText
        if (isScheduledCampaign(editableCampaign)) {
            if (editableCampaign.scheduledType === 'NOW') {
                dialogText =
                    'Publishing this campaign will start delivering it immediately. Continue?'
            } else if (editableCampaign.scheduledType === 'SCHEDULED') {
                const {
                    scheduledTimeZone,
                    scheduledUseLocalDeviceTime
                } = editableCampaign

                const monthAndDay = getFormatDate(
                    'scheduledDate'
                ).toLocaleString('en-us', {
                    month: 'long',
                    day: 'numeric'
                })

                const displayTime = getDisplayTime('scheduledTime')

                const displayScheduledTimezone = scheduledUseLocalDeviceTime
                    ? "using the devices' local time zone"
                    : scheduledTimeZone

                // tslint:disable-next-line:max-line-length
                dialogText = `Publishing this campaign will schedule it for delivery on ${monthAndDay} at ${displayTime} ${displayScheduledTimezone}. Continue?`
            }
        }

        if (isAutomatedNotificationCampaign(editableCampaign)) {
            // ToDo
        }

        return dialogText
    }

    return (
        <Dialog
            buttonPrimaryText="Cancel"
            buttonSecondaryText="Publish"
            primaryOnClick={handlePublishCampaignPrompt}
            secondaryOnClick={() => {
                publishCampaign(campaignId)
                handlePublishCampaignPrompt()
            }}
            isOpen={true}
            targetParent={
                device === 'Desktop' ? 'mainModalView' : 'mainModalLeft'
            }
            dialogText={getDialogText()}
        />
    )
}

const mapStateToProps = (state: State): PublishDialogStateProps => ({
    editableCampaign: getEditableCampaign(state) as ScheduledCampaign,
    getDisplayTime: (timeField: string) =>
        getEditableCampaignDisplayTime(state, timeField),
    getFormatDate: (dateField: string) =>
        getEditableCampaignFormatDate(state, dateField)
})

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        publishCampaign: campaignId => {
            dispatch(publishCampaign(campaignId))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishCampaignConfirmationDialog)
