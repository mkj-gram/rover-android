/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { getEditableCampaign, getDisplayTime } from '../../../reducers'
import { publishCampaign } from '../../../actions'

import { Dialog } from '@rover/ts-bootstrap/dist/src'
import {
    isScheduledCampaign,
    isAutomatedNotificationCampaign
} from '../../home/CampaignsList'

export interface PublishDialogProps extends InjectedProps {
    campaignId: number
    handlePublishCampaignPrompt: () => void
}

export interface PublishDialogStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    displayTime: string
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
    displayTime
}) => {
    const getDialogText = () => {
        let dialogText
        if (isScheduledCampaign(editableCampaign)) {
            if (editableCampaign.scheduledType === 'NOW') {
                dialogText =
                    'Publishing this campaign will start delivering it immediately. Continue?'
            } else if (editableCampaign.scheduledType === 'SCHEDULED') {
                const {
                    scheduledDate,
                    scheduledTimeZone,
                    scheduledUseLocalDeviceTime
                } = editableCampaign

                const monthAndDay = new Date(scheduledDate).toLocaleString(
                    'en-us',
                    {
                        month: 'long',
                        day: 'numeric'
                    }
                )

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
    displayTime: getDisplayTime(state)
})

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        publishCampaign: campaignId => {
            dispatch(publishCampaign(campaignId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    PublishCampaignConfirmationDialog
)
