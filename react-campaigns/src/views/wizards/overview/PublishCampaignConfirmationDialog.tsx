/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { getEditableCampaign } from '../../../reducers'
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
    publishCampaign
}) => {
    const getDialogText = () => {
        let dialogText
        if (isScheduledCampaign(editableCampaign)) {
            if (editableCampaign.scheduledType === 'NOW') {
                dialogText =
                    'Publishing this campaign will start delivering it immediately. Continue?'
            } else if (editableCampaign.scheduledType === 'SCHEDULED') {
                const {
                    scheduledTime,
                    scheduledDate,
                    scheduledTimeZone
                } = editableCampaign

                const date = new Date(null)
                date.setSeconds(scheduledTime)
                const isoTime = date.toISOString().substr(11, 8)
                const minute = parseInt(isoTime.substr(3, 2), 10)
                let hour = parseInt(isoTime.substr(0, 2), 10)

                let period = 'AM'
                if (hour > 12) {
                    hour = hour - 12
                    period = 'PM'
                }

                const dateScheduledTime = new Date(scheduledDate)
                const day = dateScheduledTime.getDate()
                const month = dateScheduledTime.getMonth() + 1

                // tslint:disable-next-line:max-line-length
                dialogText = `Publishing this campaign will schedule it for delivery on ${month} ${day} at ${hour} ${minute} ${period} ${scheduledTimeZone}. Continue?`
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
    editableCampaign: getEditableCampaign(state) as ScheduledCampaign
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
