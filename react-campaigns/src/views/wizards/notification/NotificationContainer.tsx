/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { parse } from 'qs'
import { connect, Dispatch } from 'react-redux'
import { white, Button } from '@rover/ts-bootstrap/dist/src'

import AlertOptionsContainer from './AlertOptionsContainer'
import TapBehaviorContainer from './TapBehaviorContainer'
import MessageAndMedia from './MessageAndMedia'
import AdvancedSettingsContainer from './AdvancedSettingsContainer'

import Form from '../Form'
import { updateNotificationSettings } from '../../../actions'
import { getCampaign } from '../../../reducers/campaigns'
import { getIsWizardModalClosing } from '../../../reducers'

export interface NotificationContainerStateProps {
    campaign: Campaign
    isWizardModalClosing: boolean
}

export interface NotificationContainerProps {
    device: Media
}

export interface NotificationContainerDispatchProps {
    updateNotificationSettings: () => void
}

const NotificationContainer: React.SFC<
    NotificationContainerProps &
        NotificationContainerStateProps &
        NotificationContainerDispatchProps
> = ({
    campaign,
    device,
    isWizardModalClosing,
    updateNotificationSettings
}) => {
    const campaignId = parse(location.search.substring(1)).campaignId
    let animate = isWizardModalClosing ? 'close' : 'open'

    const type: UIStateType = 'notification'

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                background: white,
                animation: `${animate} 500ms ease`
            }}
            id="notificationContainer"
        >
            <Form
                type={type}
                campaignId={campaignId}
                saveAndClose={updateNotificationSettings}
                device={device}
            >
                <MessageAndMedia
                    device={device}
                    wizardSection="messageAndMedia"
                />
                <AlertOptionsContainer
                    campaign={
                        campaign as
                            | ScheduledCampaign
                            | AutomatedNotificationCampaign
                    }
                    device={device}
                    wizardSection="alertOptions"
                />
                <TapBehaviorContainer
                    campaign={
                        campaign as
                            | ScheduledCampaign
                            | AutomatedNotificationCampaign
                    }
                    device={device}
                    wizardSection="tapBehavior"
                />
                <AdvancedSettingsContainer
                    wizardSection="advancedSettings"
                    device={device}
                />
            </Form>
        </div>
    )
}

const mapStateToProps = (state: State): NotificationContainerStateProps => ({
    campaign: getCampaign(
        state.campaigns,
        parse(location.search.substring(1)).campaignId
    ),
    isWizardModalClosing: getIsWizardModalClosing(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): NotificationContainerDispatchProps => ({
    updateNotificationSettings: () => dispatch(updateNotificationSettings())
})

export default connect(mapStateToProps, mapDispatchToProps)(
    NotificationContainer
)
